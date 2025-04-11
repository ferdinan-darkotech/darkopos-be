import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetCustomers, srvGetCustomerById, srvGetCustomerByCode, srvCustomerExist, srvGetOneCustomerByCode,
  srvCreateCustomer, srvUpdateCustomer, srvDeleteCustomer, srvGetListOfVerifiedMember, srvGetMemberCode, 
  srvGetStatsVerified, srvReVerify, srvFixVerify
} from '../../../../services/v2/master/customer/srvCustomerList'
import { srvGetMemberCategoryByCode } from '../../../../services/v2/master/customer/srvCustomerCategory'
import { getSettingByCodeV2 } from '../../../../services/settingService'
import { srvGetDataDepartmentByCode } from '../../../../services/v2/master/other/srvDepartment'
import { getSequenceFormatByCode } from '../../../../services/sequenceService'
import { sendMessages, kirimPesan } from '../../../../services/v2/other/WA-Bot/srvWA'
import { srvGetTemplateMessageByCode, srvGetVerificationWaContentMsg } from '../../../../services/v2/other/srvMessageTemplate'
import { srvGetStoreSetting } from '../../../../services/v2/master/store/srvStore'
import { splittingRegexText } from '../../../../utils/operate/objOpr'
import Storages from '../../../../utils/storages'
import Sockets from '../../../../utils/socket'
import { getStoreQuery } from '../../../../services/setting/storeService'
import { fonnteMsg, srvGetWaMessages } from '../../../../services/v2/other/Fonnte/srvFonnte'

// Get Customers
const getCustomers = function (req, res, next, filter = false, comment = 'getCustomers') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = Number(page) !== 0 ? {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  } : {}
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }

  srvGetCustomers(req.query, filter).then((customer) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: customer.count,
      data: customer.rows
    })
  }).catch(err => next(new ApiError(422, `ZCCL-00001: Couldn't find Customers`, err)))
}

// Get General Customers
exports.getCustomersGeneral = function (req, res, next) {
  getCustomers(req, res, next, false, 'getCustomersGeneral')
}

// Get Filtered Customers
exports.getCustomersFilter = function (req, res, next) {
  getCustomers(req, res, next, true, 'getCustomersFilter001')
}

// Get A Customer By Code
exports.getCustomerByCode = function (req, res, next) {
  console.log('Requesting-getCustomerByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  return srvGetCustomerByCode(code, req.query).then((customer) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: customer
    })
  }).catch(err => next(new ApiError(422,`ZCCL-00002: Couldn't find Customer`, err)))
}

// Create a Customer
exports.insertCustomer = async function (req, res, next) {
  console.log('Requesting-insertCustomer02: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = req.$userAuth
  if(data.kelid === null || data.kelid === undefined) {
    next(new ApiError(422, `ZCEP-00003: Couldn't create Employee, Info Wilayah is required .`))
    return
  }
  return new Promise(async (resolve) => {
    if(typeof data.department === 'string') {
      const currDepartment = await srvGetDataDepartmentByCode(data.department)

      if(!currDepartment) throw new Error('Department is not found.')
      data.dept_id = currDepartment.id
    }
    // if ((data.memberGetDefault || {}).bySystem) {
    const sequence = await getSequenceFormatByCode({ seqCode: 'CUST', type: '1' })
    data.memberCode = sequence
    // }
    return srvGetMemberCategoryByCode(data.membercategorycode).then(async mcb => {
      const { id: membercategoryid } = mcb || {}
      if(!membercategoryid) {
        throw new Error('Member category couldn\'t find ...')
      }
      if(!data.memberstoreid) {
        throw new Error('Member store couldn\'t find ...')
      }
      const settingApproval = await getSettingByCodeV2('SETTAPPV')

      return srvCreateCustomer({ ...data, membercategoryid }, userLogIn.userid, next).then((created) => {
        if (created) {
          
          if(((settingApproval || {}).settingvalue || {}).createdMember) {
            const jsonObj = {
              status_code: 202,
              success: true,
              message: `Customer ${data.memberCode} need to be approved`,
              data: 'Contact your SPV.'
            }
            res.xstatus(202).json(jsonObj)
          } else {
            return srvGetCustomerById(created.id).then((result) => {
              if (result) {
                const jsonObj = {
                  status_code: 200,
                  success: true,
                  message: `Customer ${result.memberCode} created`,
                  data: result
                }
                res.xstatus(200).json(jsonObj)
              } else {
                next(new ApiError(422, `ZCCL-00001: Couldn't create Customer ${data.memberCode} .`))
              }
            }).catch(err => next(new ApiError(422, `ZCCL-00002: Couldn't find Customer ${data.memberCode}.`, err)))
          }
        } else {
          next(new ApiError(422, `ZCCL-00003x: Couldn't create Customer ${data.memberCode} .`))
        }
      })
    }).catch(err => next(new ApiError(422, `ZCCL-00004: Couldn't create Customer ${data.memberCode}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCCL-00005: Couldn't create Customer ${data.memberCode}.`, err)))
}

// Update a Customer
exports.updateCustomer = function (req, res, next) {
  console.log('Requesting-updateCustomer: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = req.$userAuth
  if(data.kelid === null || data.kelid === undefined) {
    next(new ApiError(422, `ZCEP-00003: Couldn't create Employee, Info Wilayah is required .`))
    return
  }
  return srvGetMemberCategoryByCode(data.membercategorycode).then(async mcb => {
    if(typeof data.department === 'string') {
      const currDepartment = await srvGetDataDepartmentByCode(data.department)

      if(!currDepartment) throw new Error('Department is not found.')
      data.dept_id = currDepartment.id
    }

    const { id: membercategoryid } = mcb || {}
    if(!membercategoryid) {
      throw new Error('Member category couldn\'t find ...')
    }
    srvCustomerExist(data.code).then(exists => {
      if(data.code === 'CU00000001') throw new Error()
      if (exists) {
        return srvUpdateCustomer({ ...data, membercategoryid }, userLogIn.userid, next).then((updated) => {
          return srvGetCustomerByCode(data.code).then((result) => {
            let jsonObj = {
              success: true,
              message: `Customer ${result.memberCode} updated`,
              data: result
            }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(422, `ZCCL-00007: Couldn't update Customer ${data.code}.`, err)))
        }).catch(err => next(new ApiError(422, `ZCCL-00008: Couldn't update Customer ${data.code}.`, err)))
      } else {
        next(new ApiError(422, `ZCCL-00009: Couldn't find Customer ${data.code} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCCL-00010: Couldn't find Customer ${data.code} .`, err)))
  }).catch(er => next(new ApiError(422, `ZCCL-00000u: Couldn't create Customer ${data.memberCode} .`)))
}

// Delete a Customer
exports.deleteCustomer = function (req, res, next) {
  console.log('Requesting-deleteCustomer: ' + req.url + ' ...')
  const memberCode  = req.params.code
  srvCustomerExist(memberCode).then(exists => {
    if (exists) {
      srvDeleteCustomer(memberCode, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Customer ${memberCode} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCCL-00011: Couldn't delete Customer ${memberCode}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCCL-00012: Couldn't delete Customer ${memberCode}.`, err)))
    } else {
      next(new ApiError(422, `ZCCL-00013: Customer ${memberCode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCCL-00014: Customer ${memberCode} not exists.`, err)))
}

// Old Verify (Aidil)
exports.verificationNumberWA = function (req, res, next) {
  console.log('Requesting-verificationsNumberWA: ' + req.url + ' ...')
  const mobileNumber  = (req.body.idName || '').replace(/[^0-9]/g, '').replace(/^08/g, '628')
  const currTime = (new Date().getTime()).toString()
  const _initialKey = `{RESP-VRFY-CUST-WA}{${currTime}}VERIFICATION-OKE`
  const userLogIn = req.$userAuth
  const keyStorages = `${currTime}:${mobileNumber}`

  return srvGetStoreSetting(req.body.store).then(store => {
    const settVal = (store || {}).settingvalue
    const notifSetting = (settVal || {}).notifSetting
    
    if(!notifSetting.WA) throw new Error('Cannot found notifications.') 

    const dataInfo = { ID: currTime, USER: userLogIn.userid }
    return srvGetTemplateMessageByCode(`[${notifSetting.prefix}]SEND-VRFY-CUST-WA`, dataInfo, true).then(async template => {
      if(!template) throw new Error('Template message is not found.')
      
      const { content_body } = template
      
      return sendMessages({
        priority: true,
        sendTo: [mobileNumber],
        activation_key: notifSetting.WA,
        textMsg: content_body.content,
        dynamicMessages: content_body.dynamic
      }).then(msgSend => {
        if(!msgSend.success) {
          throw new Error(msgSend.detail)
        } else {
          Storages.setVerifyCustomerWA(
            keyStorages,
            req.body.socketId,
            () => {
              console.log('False', userLogIn.userid, mobileNumber, 'WA')
              Sockets.sendVerifiedCustomerNumber(userLogIn.userid, mobileNumber, 'WA', false)
            }
          )
          res.xstatus(200).json({
            success: true,
            message: 'Verifications has been send.'
          })
        }
      }).catch(err => next(new ApiError(422, `ZCVRYF-00003: Couldn't verify number.`, err)))
    }).catch(err => next(new ApiError(422, `ZCVRYF-00002: Couldn't verify number.`, err)))
  }).catch(err => next(new ApiError(422, `ZCVRYF-00001: Couldn't verify number.`, err)))
}

// New Verify (Dito)
exports.verificationNumberFonnte = async function (req, res, next) {
  console.log('Requesting-verificationsNumberWA: ' + req.url + ' ...')
  const no_hp = (req.body.idName || '')
  const mobileNumber = (req.body.idName || '').replace(/[^0-9]/g, '').replace(/^08/g, '628')
  const currTime = (new Date().getTime()).toString()
  const _initialKey = `{RESP-VRFY-CUST-WA}{${currTime}}VERIFICATION-OKE`
  const userLogIn = req.$userAuth
  const keyStorages = `${currTime}:${mobileNumber}`

  return srvGetStoreSetting(req.body.store).then(async store => {
    return srvGetStoreSetting(store.storeparentcode).then(async storeparent => {
      const settVal = storeparent.settingvalue.notifSetting || store.settingvalue.notifSetting
      const notifSetting = settVal || {}

      if(!notifSetting.WA) throw new Error('Cannot found token.')

      const verificationMsgContent = await srvGetVerificationWaContentMsg()
      if (!verificationMsgContent || verificationMsgContent === undefined || verificationMsgContent === null) {
        throw new Error('ZCVRYF-00004: Verification message content not available.');
      }

      const findMemberCode = await srvGetMemberCode(no_hp)

      return kirimPesan({
        priority: true,
        sendTo: [mobileNumber],
        member_code: findMemberCode,
        activation_key: notifSetting.WA,
        textMsg: verificationMsgContent
      }).then(msgSend => {
        if(!msgSend.success) {
          throw new Error(msgSend.detail)
        } else {
          Storages.setVerifyCustomerWA(
            keyStorages,
            req.body.socketId,
            () => {
              console.log('False', userLogIn.userid, mobileNumber, 'whatsapp')
              Sockets.sendVerifiedCustomerNumber(userLogIn.userid, mobileNumber, 'whatsapp', false)
            }
          )
          res.xstatus(200).json({
            success: true,
            message: 'Verifications has been send.'
          })
        }
      }).catch(err => next(new ApiError(422, `ZCVRYF-00003: Couldn't verify number.`, err)))
    }).catch(err => next(new ApiError(422, `ZCVRYF-00002: Couldn't verify number.`, err)))
  }).catch(err => next(new ApiError(422, `ZCVRYF-00001: Couldn't verify number.`, err)))
}

exports.checkIsVerified = async function (req, res, next) {
  console.log('Requesting-getVerifiedCustomer: ' + req.params + ' ...')
  let number = req.params.number
  let code = req.params.code
  return srvGetStatsVerified(number, code).then((verif) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: verif
    })
  }).catch(err => next(new ApiError(422,`Error_01: Couldn't find a verified customer`, err)))
}

exports.ctlGetListOfVerifiedMember = function (req, res, next) {
  return srvGetListOfVerifiedMember(req.query).then(data => {
    res.xstatus(200).json({
      success: true,
      data
    })
  }).catch(err => next(new ApiError(422, `ZCVRYF-00004: Couldn't find verify member.`, err)))
}

exports.ctlGetInvoiceTemplateCustomer = function (req, res, next) {
  const userLogIn = req.$userAuth
  return srvGetOneCustomerByCode(req.params.code).then(async member => {
    const storeInfo = await getStoreQuery({ store: userLogIn.store }, 'settingstore')
    const storeVal = (JSON.parse(JSON.stringify(storeInfo))[0] || {})
    const selfSetting = ((storeVal || {}).setting || {})
    const parentSetting = ((storeVal || {}).settingparent || {})
    const notifSetting = (parentSetting.notifSetting || selfSetting.notifSetting || {})
    const memberVerifyData = (JSON.parse(JSON.stringify(member || {})).verifications || {})

    if(typeof (memberVerifyData.WA || {}).id !== 'string')
      throw new Error('The WA number customer is not verified.')

    return srvGetTemplateMessageByCode(`[${notifSetting.prefix}]FEEDBACK-SLS-WA`).then(templates => {
      const { content_body } = templates

      const replacerTemplate = {
        STR_CODE: storeVal.storecode,
        STR_NAME: storeVal.storename,
        TRANS: req.query.transno
      }

      const sentInvoiceCustomerWA = content_body ? {
        verifyNumber: (memberVerifyData.WA.id || null),
        content: splittingRegexText(replacerTemplate, (content_body.content || '')),
        footer: splittingRegexText(replacerTemplate, (content_body.footer || '')),
        button: typeof (content_body.button || []) === 'object' && (content_body.button || []).length > 0 ?
          (content_body.button || []).map(itemBtn => {
            return { ...itemBtn, key: splittingRegexText(replacerTemplate, itemBtn.key) }
          }) : []
      } : {
        verifyNumber: memberVerifyData.WA.id || null
      }

      res.xstatus(200).json({
        success: true,
        data: sentInvoiceCustomerWA
      })
    }).catch(err => next(new ApiError(422, `ZCVRYF-00005: Couldn't get template invoice sender.`, err)))
  }).catch(err => next(new ApiError(422, `ZCVRYF-00004: Couldn't get template invoice sender.`, err)))
}

exports.fonnteWA = async function (req, res, next) {
  console.log('Requesting-insertWA: ' + req.url + ' ...')
  let data = req.body
  fonnteMsg({...data, next}).then((pesan_wa) => {
    if (pesan_wa) {
      let jsonObj = {
        success: true,
        message: `Ok`,
        data: data
      }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Error_02: Couldn't Create WA Messages ${data.wa_number} .`))
    }
  }).catch(err => next(new ApiError(422, `Error_01: Couldn't Create WA Messages ${data.wa_number}.`, err)))
}

exports.reVerify = async function (req, res, next) {
  console.log('Requesting-reVerify: ' + req.url + ' ...')
  let data = req.body
  data.number = req.params.number
  data.code = req.params.code
  try {
    const detailVerify = await srvGetStatsVerified(data.number, data.code)
    if (
      detailVerify === null ||
      Object.keys(detailVerify).length === 0 ||
      detailVerify.WA === null ||
      Object.keys(detailVerify.WA).length === 0
    ) {
      return srvReVerify ({ ...data }, next).then((reverif) => {
        if (reverif) {
          let jsonObj = {
            success: true,
            message: `Ok`,
            data: data
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Error_04: Couldn't Re-Verify ${data.number}.`))
        }
      }).catch(err => next(new ApiError(422, `Error_03: Couldn't Re-Verify ${data.number}.`, err)))
    } else {
      next(new ApiError(422, `Error_02: Couldn't Re-Verify ${data.number}.`))
    }
  } catch (err) {
    next(new ApiError(422, `Error_01: Couldn't Re-Verify ${data.number}.`, err))
  }
}

exports.ctlFixVerify = async function (req, res, next) {
  console.log('Requesting-fixVerify: ' + req.params + ' ...')
  let wano = req.params.wano
  let mc = req.params.mc
  return srvFixVerify(wano, mc).then((fixed) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: fixed
    })
  }).catch(err => next(new ApiError(422,`Error_01: Couldn't Fix Verify`, err)))
}