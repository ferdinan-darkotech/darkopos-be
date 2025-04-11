// posController
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import moment from 'moment'
import {
  setPosInfo, getPosByCode, posExists, getPosData,
  createPos, woIdExists, updatePos, deletePos, deletePoses, getLastTrans, cancelPos,
  syncMemberCashback
}
  from '../services/posService'
import { extractTokenProfile } from '../services/v1/securityService'
import { srvGetSomeStockOnHand } from '../services/v2/inventory/srvStocks'
import { srvGetStoreBranchSetting } from '../services/v2/master/store/srvStore'
import { getStoreQuery, srvGetStoreById } from '../services/setting/storeService'
import { srvGetVoucherSalesItem } from '../services/v2/transaction/srvVoucherSales'
import { compareDiffObjects } from '../utils/mapping'
import { checkStockMinus } from '../services/Report/fifoReportService'
import { srvGetSomeEmployeeByEId } from '../services/v2/master/humanresource/srvEmployee'
import { srvGetDataQueue, srvGetOneQueueById, srvGetSalesHeader } from '../services/v2/transaction/srvQueueSales'
import { srvGetCustomerByCode, srvGetCustomerById } from '../services/v2/master/customer/srvCustomerList'
import { srvFindOneApprovalVoidSales } from '../services/v2/monitoring/srvApproval'
import { srvGetTemplateMessageByCode } from '../services/v2/other/srvMessageTemplate'
import { splittingRegexText } from '../utils/operate/objOpr'
import _socket from '../utils/socket'
import { srvGetExistsTradeInByIdStore } from '../services/v2/master/stocks/srvProductTradeIN'
import { sendMessages as sendMessageWA } from '../services/v2/other/WA-Bot/srvWA'
import shortid from 'shortid'



// Retrive list a pos
exports.getPos = function (req, res, next) {
  console.log('Requesting-getPos: ' + req.params.id + ' ...')
  let transNo = req.params.id
  let storeId = req.query.storeId
  getPosByCode(transNo, storeId).then((Pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pos: Pos
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find POS ${transNo}.`, err)))
}

// Retrive list of poss
exports.getAllPos = function (req, res, next) {
  console.log('Requesting-getPosData: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getPosData(other).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: pos.length,
      data: pos
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find POS.`, err)))
}

exports.getLast = function (req, res, next) {
  console.log('Requesting-getLast: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getLastTrans(other).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(pos)),
      total: pos.length
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Transaction.`, err)))
}


const generateProductTradeIn = (listTradeIN = [], payloads = {}, storeCode = null) => {
  return new Promise(async (resolve, reject) => {
    let newListTradeIN = []
    let undefinedTradeIN = null
    
    const listTradeInProducts = listTradeIN.map(x => ({ id: x.product, store: storeCode }))

    const existingProductTradeIn = await srvGetExistsTradeInByIdStore(listTradeInProducts, true)

    for(let x in listTradeIN) {
      const items = listTradeIN[x]
      const findProducts = existingProductTradeIn.filter(a => a.product_trd_id === items.product)[0]

      if(!findProducts) {
        undefinedTradeIN = 'Some of products trade-in is not defined.'
        break
      }

      newListTradeIN.push({
        product_trade_in_id: items.product,
        ref_id: items.id,
        product: findProducts.product_id,
        store: payloads.storeId,
        qty: items.qty,
        price: items.price,
        disc_p: (items.disc_p || 0),
        disc_n: (items.disc_n || 0),
        conditions: items.conditions
      })
    }
    

    if(typeof undefinedTradeIN === 'string') {
      return reject(undefinedTradeIN)
    }

    resolve(newListTradeIN)
  })
}


// Create a new pos
exports.insertPos = function (req, res, next) {
  console.log('Requesting-insertSale: ' + req.url + ' ...')
  var transNo = req.params.id
  const userLogIn = req.$userAuth

  let pos = {
    ...req.body,
    storeId: userLogIn.store
  }

  const extensions = Array.isArray(pos.extensions) ? pos.extensions : []
  
  return posExists(transNo, pos.storeId).then(async exists => {
    const settingStoreBranch = await srvGetStoreBranchSetting(pos.storeId)

    const tradeInSetting = ((settingStoreBranch.settingparent || {}).productTradeIn || {})
    const warrantyProductSetting = (((settingStoreBranch.settingparent || {}).warranty || {}).product || {})

    let newListTradeIN = []
    let mappingWarrantyProducts = {}

    if((tradeInSetting.active || false).toString() === 'true') {
      let listTradeIN = []
      pos.dataPos.map(x => {
        let trade_in_uniq = null
        if(Array.isArray(x.trade_in) && (x.trade_in || []).length > 0) {
          trade_in_uniq = shortid.generate()
          let tmpTradeIn = (x.trade_in || []).map(a => ({ ...a, id: trade_in_uniq }))

          listTradeIN = [ ...listTradeIN, ...tmpTradeIn ]
        }
        x.trade_in = trade_in_uniq
      })

      if(listTradeIN.length > 0) {
        newListTradeIN = await generateProductTradeIn(listTradeIN, pos, settingStoreBranch.parent_store_code)
      }
    } else {
      pos.dataPos = pos.dataPos.map(x => ({ ...x, trade_in: null }))
    }


    const getMember = await srvGetCustomerById(pos.memberCode)
    const currStore = await srvGetStoreById(pos.storeId, ['storeCode', 'storeName'])
    const existsMember = JSON.parse(JSON.stringify(getMember))
    const memberVerifyData = (existsMember.verifications || {})
    
    if (exists) {
      next(new ApiError(409, `POS '${transNo}' already exists.`))
    } else if (!existsMember) {
      throw 'Data member is not found.'
    } else {
      return woIdExists(pos.woId, pos.storeId).then(woId => {
        if (woId || pos.woId === null || pos.woId === undefined || pos.woId === '') {
          let codeProduct = []
          let empId = []
          let voucher = []
          // get product & employee
          pos.dataPos.map(i => {
            if(i.vouchercode) voucher.push(i.vouchercode)
            if(i.typeCode === 'P') codeProduct.push(i.product)
            empId.push(i.employee)
          })
          const mappingProduct = {}
          return srvGetSomeEmployeeByEId(empId).then(async emp => {
            let restrictedVoucher = { status: true, message: '' }
            if(voucher.length > 0) {
              const voucherno = (pos.listAmount.filter(x => x.code === 'EVDMIVC')[0] || {}).cardNo
              if(!voucherno) {
                restrictedVoucher = { status: false, message: 'Number of Voucher cannot found' }
              } else {
                const objectQuery = { vouchercode: voucher, vld: 'XPUS' }
                const listVoucher = await srvGetVoucherSalesItem(objectQuery, 'params', { voucherno })
                for(let track in listVoucher) {
                  let indexing = -1 
                  const { itemcode, voucherid, vouchercode } = listVoucher[track]
                  pos.dataPos.map((x, y) => {
                    if(itemcode === (x.productCode || x.product) && vouchercode === x.vouchercode) indexing = y 
                  })
                  if(indexing === -1) {
                    restrictedVoucher = { status: false, message: 'Some item is not included voucher' }
                    break
                  } else {
                    pos.dataPos[indexing] = { ...pos.dataPos[indexing], voucherid }
                  }
                }
              }
            }
            
            if(restrictedVoucher.status) {
            // if(empId.length !== emp.length) throw new Error('Please re-check your detail transaction.')
              return srvGetSomeStockOnHand(codeProduct, pos.storeId).then(prod => {
                if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
                const tmpPosDetail = pos.dataPos.map((i, x) => {
                  const tmpEmployee = JSON.parse(JSON.stringify(emp)).filter(n => n.employeeId === i.employee)[0]
                  const { id: employeeId, employeeName } = tmpEmployee || {}
                  if(i.typeCode === 'P') {
                    const tmpProduct = prod.filter(n => i.product === n.productcode)[0]
                    const { productid, productcode, productname, use_warranty, valid_warranty_km, valid_warranty_period } = tmpProduct
                    const { product, ...other } = i
                    mappingProduct[productid] = other.qty

                    mappingWarrantyProducts = {
                      ...mappingWarrantyProducts,
                      [productid]: {
                        use_warranty,
                        valid_warranty_km,
                        valid_warranty_period
                      }
                    }
                    return { ...other, productCode: productcode, productId: productid, productName: productname, employeeId, employeeName }
                  } else {
                    return { ...i, employeeId, employeeName }
                  }
                })
                pos.dataPos = tmpPosDetail
                const packChecking = {
                  transno: '',
                  storeid: pos.storeId,
                  product: mappingProduct
                }
                return checkStockMinus(packChecking,'SALES', next).then(async check => {
                  if(check.STATUS === 'Y') {
                    return getStoreQuery({ store: pos.storeId }, 'settingstore').then(async stVal => {
                      const storeVal = (JSON.parse(JSON.stringify(stVal))[0] || {})
                      const selfSetting = ((storeVal || {}).setting || {})
                      const parentSetting = ((storeVal || {}).settingparent || {})
                      const notifSetting = (parentSetting.notifSetting || selfSetting.notifSetting || {})

                      const {
                        content_body
                      } = (await srvGetTemplateMessageByCode(`[${notifSetting.prefix}]FEEDBACK-SLS-WA`) || {})

                      const dataQueue = await srvGetDataQueue(pos.storeId, pos.currentQueue)
                      const newDataQueue = (JSON.parse(JSON.stringify(dataQueue)) || {})
                      const { cashier_trans: currProduct, service_detail: currService } = newDataQueue
                      let increaseDuplicate = false
                      if(newDataQueue.headerid) {
                        let newMapDetailProduct = []
                        let newMapDetailService = [] 
                        const theDataPOS = (pos.dataPos || [])
                        theDataPOS.map(x => {
                          if(x.typeCode === 'P') {
                            newMapDetailProduct.push({ code: x.productCode, qty: x.qty })
                          } else {
                            newMapDetailService.push({ code: x.productCode, qty: x.qty })
                          }
                        })
                        const compareDetailProduct = compareDiffObjects(
                          currProduct,
                          newMapDetailProduct,
                          { productcode: 'code' },
                          { productcode: 'code' }
                        )
                        const compareDetailService = compareDiffObjects(
                          currService,
                          newMapDetailService,
                          { code: 'code' },
                          { code: 'code' }
                        )           
                        increaseDuplicate = (compareDetailProduct || compareDetailService)
                        pos['queue_no'] = newDataQueue.queuenumber
                      }

                      return createPos(
                          transNo,
                          {
                            ...pos,
                            ...JSON.parse(JSON.stringify(currStore)),
                            tradeIn: newListTradeIN
                          },
                          userLogIn.userid,
                          next,
                          req,
                          storeVal,
                          increaseDuplicate,
                          {
                            warrantyProduct: warrantyProductSetting,
                            rulesWarranty: mappingWarrantyProducts,
                            extensions,
                            tradeInSetting
                          }
                        ).then((posCreated) => {
                        const replacerTemplate = {
                          STR_CODE: storeVal.storecode,
                          STR_NAME: storeVal.storename,
                          TRANS: posCreated.resultInvoiceNo
                        }
                        let sentInvoiceCustomerWA = content_body ? {
                          verifyNumber: (memberVerifyData.WA || {}).id || null,
                          content: splittingRegexText(replacerTemplate, (content_body.content || '')),
                          footer: splittingRegexText(replacerTemplate, (content_body.footer || '')),
                          button: typeof (content_body.button || []) === 'object' && (content_body.button || []).length > 0 ?
                            (content_body.button || []).map(itemBtn => {
                              return { ...itemBtn, key: splittingRegexText(replacerTemplate, itemBtn.key) }
                            }) : []
                        } : {
                          verifyNumber: (memberVerifyData.WA || {}).id || null
                        }

                        if (posCreated) {
                          let jsonObj = {
                            success: true,
                            message: `POS created`,
                            pos: posCreated,
                            memberInfo: {
                              sentInvoiceCustomerWA,
                              ...existsMember
                            }
                          }
                          _socket.queueApprovalNotif(req.body.socketId, pos.storeId, 'refreshonly')
                          res.xstatus(200).json(jsonObj)
                        }
                      }).catch(err => next(new ApiError(501, `Couldn't create pos ${transNo}.`, err)))
                    }).catch(er => {
                      throw new Error(check.message)
                    })
                  } else {
                    throw new Error(check.RESULT)
                  }
                }).catch(err => next(new ApiError(501, `Couldn't create pos ${transNo}.`, err)))
              }).catch(err => next(new ApiError(501, `Couldn't create pos ${transNo}.`, err)))
            } else {
              throw new Error(restrictedVoucher.message)
            }
          }).catch(err => next(new ApiError(501, `Couldn't create pos ${transNo}.`, err)))
        } else {
          next(new ApiError(409, `Workorder not exists or already used.`))
        }
      }).catch(err => next(new ApiError(501, `Couldn't create pos ${transNo}.`, err)))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create pos ${transNo}.`, err)))
}

//Update Pos
exports.updatePos = function (req, res, next) {
  console.log('Requesting-updatePos: ' + req.url + ' ...')
  let id = req.body.id
  let pos = req.body.data
  const userLogIn = extractTokenProfile(req)
  posExists(pos.transNo, pos.storeId).then(exists => {
    if (exists) {
      return updatePos(id, pos, userLogIn.userid, next).then((posUpdated) => {
        return getPosByCode(pos.transNo, pos.storeId).then((posByCode) => {
          const posInfo = setPosInfo(posByCode)
          let jsonObj = {
            success: true,
            message: `POS of ${posByCode.transNo} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { pos: posInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update POS ${pos.transNo}.`, err)))
      }).catch(err => next(new ApiError(422, `Couldn't find POS ${pos.transNoid}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find POS of ${pos.transNo} .`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find POS ${pos.transNo} .`, err)))
}

//Cancel Pos
exports.cancelPos = function (req, res, next) {
  console.log('Requesting-cancelPos: ' + req.url + ' ...')
  var transNo = req.params.id
  let pos = req.body
  const userLogIn = extractTokenProfile(req)
  return getPosByCode(transNo, pos.storeId).then(exists => {
    const approvalPayload = {
      transno: transNo,
      storeid: pos.storeId,
      appvstatus: 'P'
    }
    return srvFindOneApprovalVoidSales(approvalPayload).then(vsls => {
      if((vsls || {}).appvid) throw new Error('Approval in progress, please contact your SPV.')
      const dataPos = JSON.parse(JSON.stringify(exists)) || {}
      if (exists.transDate && pos.status === 'C') {
        const dateNow = moment().endOf('day').format('YYYY-MM-DD') // moment().format('YYYY-MM-01')
        const dateInvoice = moment(exists.transDate).endOf('day').format('YYYY-MM-DD') // moment(exists.transDate).format('YYYY-MM-01')
        if(dateNow === dateInvoice) { // moment(dateNow).diff(dateInvoice, 'months', true) === 0
          return cancelPos(transNo, pos, userLogIn.userid, next).then((posUpdated) => {
            if(!posUpdated.success) {
              throw new Error(posUpdated.message)
            } else {
              let jsonObj = {
                success: true,
                message: posUpdated.message,
                approval: posUpdated.approval,
                appvno: posUpdated.appvno
              }
              if(posUpdated.approval) {
                res.xstatus(200).json(jsonObj)
              } else {
                return getPosByCode(transNo, pos.storeId).then((posByCode) => {
                  const posInfo = setPosInfo(posByCode)
                  if (project.message_detail === 'ON') { Object.assign(jsonObj, { pos: posInfo }) }
                  res.xstatus(200).json(jsonObj)
                }).catch(err => next(new ApiError(501, `Couldn't update POS ${transNo}.`, err)))
              }
            }
          }).catch(err => next(new ApiError(422, `Couldn't find POS ${transNo}.`, err)))
        } else {
          next(new ApiError(422, 'Coudn\'t void invoice in diffrent day'))
        }
      } else {
        next(new ApiError(422, 'Couldn\'t find Invoice'))
      }
    }).catch(err => next(new ApiError(422, `Approval of ${pos.transNo} has been exists.`, err)))
  }).catch(err => next(new ApiError(422, `Couldn't find POS ${pos.transNo} .`, err)))
}

//Delete a Pos
exports.deletePos = function (req, res, next) {
  console.log('Requesting-deletePos: ' + req.url + ' ...')
  let transNo = req.params.id
  const storeid = req.params.store
  posExists(transNo).then(exists => {
    if (exists) {
      deletePos(transNo).then((posDeleted) => {
        if (posDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `POS ${transNo} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { pos: posDeleted }) }
          
          // _socket.queueApprovalNotif(req.body.socketId, storeid, 'refreshonly')
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `POS ${transNo} fail to delete.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete POS ${transNo}.`, err)))
    } else {
      next(new ApiError(422, `POS ${transNo} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `POS ${transNo} not exists.`, err)))
}

//Delete some Pos
exports.deletePoses = function (req, res, next) {
  console.log('Requesting-deletePoses: ' + req.url + ' ...')
  let poses = req.body;
  deletePoses(poses).then((posDeleted) => {
    if (posDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `POS [ ${poses.transNo} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { poses: posDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete POS [ ${poses.transNo} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete POS [ ${poses.transNo} ].`, err)))
}

async function sendConfirmPaymentByWA (activationId, sendTo, data) {
	try {
		const templates = await srvGetTemplateMessageByCode('FLOW-SLS-CNFRM-PAYM', {
      CustomerName: data.member_name,
      PoliceNo: data.unit_no,
      Netto: data.netto,
      QueueNo: data.queue
    }, true)
    const contentText = ((templates.content_body || {}).content || '')
		let contentDynamic = ((templates.content_body || {}).dynamic || null)

		contentDynamic.dataBody = {
			...contentDynamic.dataBody,
			dataInfo: {
				...data
			}
		}

		return sendMessageWA({
      priority: true,
      activation_key: activationId,
      sendTo: [sendTo],
      textMsg: contentText,
			dynamicMessages: contentDynamic
    })
	} catch (er) {
		throw er
	}
}

exports.confirmPayments = function (req, res, next) {
  console.log('Requesting-confirmPayments: ' + req.url + ' ...')
  const dataBody = req.body

  return getStoreQuery({ store: dataBody.store }, 'settingstore').then(async stVal => {
		const selfSetting = ((stVal[0] || {}).setting || {})
		const parentSetting = ((stVal[0] || {}).settingparent || {})

    const currQueue = (await srvGetSalesHeader(dataBody.header) || {})

		const salesFlowConfirmations = (selfSetting.salesFlowConfirmations || {})

    if(typeof salesFlowConfirmations.payment === 'boolean' && salesFlowConfirmations.payment && typeof currQueue.confirm_id === 'string') {
      const activationWaID = ((parentSetting.notifSetting || selfSetting.notifSetting || {}).WA || null)
      const getMember = await srvGetCustomerByCode(dataBody.member)
      const existsMember = JSON.parse(JSON.stringify(getMember))
      const memberVerifyData = (existsMember.verifications || {})

      let resultsRequest = null
      let targetId = null

      const newPayloads = {
        header: dataBody.header,
        confirm_id: currQueue.confirm_id,
        queue: dataBody.queue,
        unit_no: dataBody.unit,
        member_code: existsMember.memberCode,
        member_name: existsMember.memberName,
        netto: dataBody.netto
      }

      if(req.params.type === 'WA' && typeof memberVerifyData.WA === 'object' && !!memberVerifyData.WA) {
        const sendTo = memberVerifyData.WA.id
        targetId = sendTo
        resultsRequest = sendConfirmPaymentByWA(activationWaID, sendTo, newPayloads)
      } else {
        throw new Error('Phone number is not exists or never verified.')  
      }

      return resultsRequest.then(ok => {
        res.xstatus(200).json({
          success: true,
          message: `Confirmations has been sent to ${targetId}.`
        })
      }).catch(err => next(new ApiError(501, `Couldn't send payment confirmations.`, err)))
    } else if (typeof currQueue.confirm_id !== 'string') {
      throw new Error('Confirmation ID is not defined.')
    } else {
      throw new Error('Confirmations payment is disabled.')
    }
  }).catch(err => next(new ApiError(501, `Couldn't send payment confirmations.`, err)))
}


exports.confirmTapIn = async function (req, res, next) {
  console.log('Requesting-confirmTapIn: ' + req.url + ' ...')
  const dataBody = req.body
  
  return getStoreQuery({ store: dataBody.store }, 'settingstore').then(async stVal => {

    const selfSetting = ((stVal[0] || {}).setting || {})
		const parentSetting = ((stVal[0] || {}).settingparent || {})


		const salesFlowConfirmations = (selfSetting.salesFlowConfirmations || {})

    const activationWaID = ((parentSetting.notifSetting || selfSetting.notifSetting || {}).WA || null)

    if(typeof salesFlowConfirmations.mechanics === 'boolean' && !salesFlowConfirmations.mechanics) throw new Error('Configuration is not enabled.')

    return srvGetSalesHeader(dataBody.queue_id).then(async queue => {
      if(!queue) throw new Error('Queue is not found.')

      const templates = await srvGetTemplateMessageByCode('FLOW-SLS-CNFRM-TAPIN-MCH', {
        StoreID: dataBody.store,
        QueueID: dataBody.queue_id,
        QueueNo: queue.queuenumber,
        RawCustLocation: dataBody.customer_location,
        MechContact: dataBody.mechanic_contact,
        MechCode: dataBody.mechanic_code,
        MechName: dataBody.mechanic_name,
        CustName: dataBody.customer_name,
        CustCode: dataBody.customer_code,
        UnitNo: dataBody.unit,
        CustContact: dataBody.customer_contact,
        CustLocation: `Lokasi Customer : \\n${typeof dataBody.customer_location === 'string' && dataBody.customer_location !== '' ? `https://www.google.com/maps/place/${dataBody.customer_location}` : 'Belum tersedia'}`
      }, true)
      const contentText = ((templates.content_body || {}).content || '')
      let contentDynamic = ((templates.content_body || {}).dynamic || null)

      return sendMessageWA({
        priority: true,
        activation_key: activationWaID,
        sendTo: [dataBody.mechanic_contact],
        textMsg: contentText,
        dynamicMessages: contentDynamic
      }).then(ok => {
        console.log('OK', ok)
        res.xstatus(200).json({
          success: true,
          message: 'Confirmation messages has been sent.'
        })
      })
    }).catch(err => next(new ApiError(501, `Couldn't send tap-in confirmations.`, err)))
  }).catch(err => next(new ApiError(501, `Couldn't send tap-in confirmations.`, err)))
}

