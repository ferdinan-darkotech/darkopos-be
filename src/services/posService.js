import db from '../models'
import dbv from '../models/view'
import dbvr from '../models/viewR'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import sequelize from '../native/sequelize'
import moment from 'moment'
import { getSequenceFormatByCode } from './sequenceService'
import { getDataCode } from './loyalty/loyaltyService'
import { increaseMemberCashback, updateMemberCashback, getUserCashback } from './member/memberService'
import { getDataByStoreAndCode, increaseSequence } from './sequencesService'
import { createBulkPayment } from './payment/paymentService'
import { checkIfBundlingNeedUniqueKey } from './master/bundlingService'
import { getDataByPosId } from './loyalty/memberCashbackService'
import { countCashback, reArrangedCashbackIn, reArrangedCashbackOut } from './pos/cashback'
import { getTotalPos, reArrangedBundling, reArrangedPosDetail } from './pos/posdetail'
import { srvDestroyByCondition, srvGetDetailQueue } from './v2/transaction/srvQueueSales'
import { srvVoidSalesInvoice } from './v2/monitoring/srvApproval'
import { getNativeQuery } from '../native/nativeUtils'
import { srvCreatePointHistory, srvCreateCouponClaim } from './v2/transaction/srvTransCustomerCoupon'
import { srvCreateBulkBuyProductTradeIn } from './v2/master/stocks/srvProductTradeIN'
import { srvCreateWarrantyProducts } from './v2/monitoring/srvWarranty'
import { srvSaveNPSMonit } from './v2/other/Dynamic-Form/controls/srvDynamicFormMonit'
import { generateLinkDynamicForm } from './v2/other/Dynamic-Form/connections'
import { srvGetTemplateMessageByCode } from './v2/other/srvMessageTemplate'

import sockets from '../utils/socket'


const tableMemberCashback = db.tbl_member_cashback
const Pos = db.tbl_pos
const PosDetail = db.tbl_pos_detail
const PosBundling = db.tbl_pos_bundling
const vw_wo_001 = dbvr.vw_main_wo
const PosView = dbv.vw_pos

const posViewField = ['id', 'no_tax_series', 'woId', 'wono', 'storeId', 'cashierTransId', 'cashierName', 'transNo', 'woReference', 'technicianName', 'technicianId', 'memberId', 'memberCode', 'memberName', 'transDate', 'total', 'creditCardNo', 'creditCardType', 'creditCardCharge',
  'phoneNumber', 'mobileNumber', 'totalCreditCard', 'discount', 'rounding', 'paid', 'change', 'policeNo', 'policeNoId', 'year', 'merk', 'model', 'type', 'chassisNo', 'machineNo', 'lastMeter', 'discountLoyalty', 'lastCashback', 'gettingCashback', 'status', 'memo', 'paymentVia', 'taxType',
  'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'createdByName', 'current_duplicate', 'total_duplicate'
]

//getPosByCode,
export function getPosByCode (transNo, storeId) {
  return PosView.findOne({
    attributes: posViewField,
    where: {
      transNo: transNo,
      storeId: storeId
    },
    raw: false
  })
}

export function getWoIdByStore (woId, storeId) {
  return vw_wo_001.findOne({
    where: {
      id: woId,
      storeId: storeId,
      status: 'A'
    },
    raw: false
  })
}

export function getLastTrans (query) {
  return Pos.findAll({
    attributes: ['transNo'],
    where: {
      transNo: {
        $like: 'FJ%'
      },
    }
  })
}

export function getPosData (query) {
  const start = query.startPeriod
  const end = query.endPeriod
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { between: query[key] }
    }
  }
  const { startPeriod, endPeriod, storeId, field, period, type, ...other } = query
  if (query) {
    // postgresql required
    const extCondition = query.type === 'PERIOD' ? { '': sequelize.literal(`to_char(transdate, 'YYYY-MM') = '${period}'`) } : { transDate: {
      $between: [start, end],
    } }
    return PosView.findAll({
      attributes: field ? field.split(',') : posViewField,
      where: {
        ...extCondition,
        storeId: query.storeId,
        ...other
      },
      order: [['transDate', 'ASC'], ['transNo', 'ASC']]
    })
  } else {
    return PosView.findAll({
      attributes: field ? field.split(',') : posViewField,
      order: [['transDate', 'ASC'], ['transNo', 'ASC']],
    })
  }
}

export function setPosInfo (request) {
  return ({
    id: request.id,
    transNo: request.transNo,
    technicianId: request.technicianId,
    memberCode: request.memberCode,
    // cashierNo: request.cashierNo,
    // cashierId: request.cashierId,
    // shift: request.shift,
    transDate: request.transDate,
    total: request.total,
    creditCardNo: request.creditCardNo,
    creditCardType: request.creditCardType,
    creditCardCharge: request.creditCardCharge,
    totalCreditCard: request.totalCreditCard,
    discount: request.discount,
    rounding: request.rounding,
    paid: request.paid,
    change: request.change,
    lastMeter: request.lastMeter,
    // policeNo: request.policeNo,
    policeNoId: request.policeNoId,
    status: request.status,
    memo: request.memo,
    paymentVia: request.paymentVia,
  })
}

export function posExists (transNo, storeId) {
  return getPosByCode(transNo, storeId).then(pos => {
    if (pos === null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function woIdExists (woId, storeId) {
  return getWoIdByStore(woId, storeId).then(pos => {
    if (pos === null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function insertPosHeader (pos, sequence, lastCashback, gettingCashback, createdBy, transaction) {
  return Pos.create({
    transNo: sequence,
    storeId: pos.storeId,
    transDate: pos.transDate,
    technicianId: pos.technicianId,
    woId: pos.woId,
    memberCode: pos.memberCode,
    // cashierNo: pos.cashierNo,
    cashierTransId: pos.cashierTransId,
    // cashierId: pos.cashierId,
    // shift: pos.shift,
    transTime: pos.transTime,
    lastCashback,
    gettingCashback,
    discountLoyalty: pos.discountLoyalty,
    total: pos.total,
    creditCardNo: pos.creditCardNo,
    queue_no: pos.queue_no,
    taxType: pos.taxType,
    taxval: pos.taxVal,
    creditCardType: pos.creditCardType,
    creditCardCharge: pos.creditCardCharge,
    totalCreditCard: pos.totalCreditCard,
    discount: pos.discount,
    rounding: pos.rounding,
    paid: pos.paid,
    change: pos.change,
    lastMeter: pos.lastMeter,
    // policeNo: pos.policeNo,
    policeNoId: pos.policeNoId,
    paymentVia: pos.paymentVia,
    woReference: pos.woReference,
    // usingWo: pos.usingWo,
    createdBy: createdBy,
    createdAt: moment(),
    user_agent: pos.user_agent,
    total_dpp: pos.total_dpp,
    total_ppn: pos.total_ppn,
    total_netto: pos.total_netto,
    total_products: pos.total_products,
    total_services: pos.total_services,
    stat_tax_series: (pos.stat_tax_series || '00')
  }, { transaction }).then(rs => {
    return { success: true, data: rs }
  }) .catch(er => {
    throw new Error(er.message)
  })
}

export async function insertPosHeaderBulk (arrayProd, transaction) {
  return Pos.bulkCreate(
    arrayProd,
    { transaction, returning: ['*'] }
  ).then(rs => {
    return { success: true, data: rs }
  }) .catch(er => {
    throw new Error(er.message)
  })
}

export async function insertPosDetail (arrayProd, transaction) {
  return PosDetail.bulkCreate(
    arrayProd,
    { transaction, returning: ['*'] }
  ).then(rs => {
    return { success: true, data: rs }
  }) .catch(er => {
    throw new Error(er.message)
  })
}

export async function insertPosBundling (arrayBundling, transaction) {
  return PosBundling.bulkCreate(
    arrayBundling,
    { transaction }
  )

}

export async function insertCashback (dataLoyalty, transaction) {
  return tableMemberCashback.create(
    dataLoyalty,
    { transaction }
  )
}

async function generateRatingForm (waKey, { ...data }) {
  try {
    const templates = await srvGetTemplateMessageByCode('FJ-RATING')

    if(templates) {
      const { formID } = (templates.content_body || {})

      // sockets.bulkSendBroadcast(
      //   'LIVE-MONITORING-NPS',
      //   'receiveMonitoringNPS', {
      //     STORE: data.branch_code
      //   }, {
      //     groups: 'FJ-RATING',
      //     action: 'INCOMING',
      //     data: saveNPS
      //   }
      // )

      const generateLinks = await generateLinkDynamicForm({
        license: 'bf475-c3331-09c81-4dbfb-6bb0f-5bb08',
        formID
      })

      if(generateLinks.success) {
        const { data: dataLink } = generateLinks

        const saveNPS = await srvSaveNPSMonit({
          groups: 'FJ-RATING',
          url_link: dataLink.hyperlink,
          public_id: dataLink.publicId,
          payload: {
            store_code: data.store_code,
            store_name: data.store_name,
            trans_no: data.trans_no,
            activation_wa: waKey
          },
          created_at: moment().unix()
        })

        sockets.bulkSendBroadcast(
          'LIVE-FORM-NPS',
          'receiveFormRatingNPS', {
            STORE: data.store_code
          }, {
            data: {
              url: dataLink.hyperlink,
              publish_at: dataLink.publish_at
            }
          }
        )
      }
    }
  } catch (er) {
    console.log('>>>', er)
    return null
  }
}

export async function createPos (transNo, pos, createdBy, next, req, settingStore, increaseDuplicate, additionalProps) {
  const posDetail = pos.dataPos
  const posBundling = (pos.dataBundle || [])
  const payment = pos.listAmount
  const user_agent = req.headers["user-agent"]
  const extensions = additionalProps.extensions
  const salesTax = ((settingStore.settingparent || settingStore.setting || {}).salesTax || {})

  const notifSetting = ((settingStore.settingparent || settingStore.setting || {}).notifSetting || {})
  const npsForm = ((settingStore.settingparent || settingStore.setting || {}).npsForm || {})

  let transaction
  if (!payment) {
    next(new ApiError(422, `Couldn't create ${transNo} please Refresh.`))
  }
  if (pos.useLoyalty !== pos.discountLoyalty) {
    return next(new ApiError(422, 'Loyalty: usage and discountLoyalty different'))
  }
  try {
    transaction = await sequelize.transaction()

    const sequence = await getSequenceFormatByCode({ seqCode: 'INV', type: pos.storeId })
    if(posBundling.length > 0) {
      const requiredUniqPromo = await checkIfBundlingNeedUniqueKey(posBundling.map(x => x.code))
      for (let x in posBundling) {
        const bundlingItem = posBundling[x]
        const isUnique = requiredUniqPromo.filter(a => a.code === bundlingItem.code)[0]

        if(!!isUnique) {
          const uniqueKeyInformations = {
            store_code: pos.storeCode,
            store_name: pos.storeName,
            users: createdBy,
            trans_no: sequence
          }
          const queryUniqPromo = `select * from sch_pos.fn_sync_history_bundling_uniq_key(
            '${bundlingItem.code}', '${bundlingItem.uniqKey}', 'USED', ${false}, '${JSON.stringify(uniqueKeyInformations)}') val`
          await getNativeQuery(queryUniqPromo, true, 'RAW', null, transaction)
        }
      }
    }

    const resultLoyalty = await getDataCode()
    const lastCashback = JSON.parse(JSON.stringify(await getUserCashback(pos.memberCode)))
    // AFXZ
    const detailQueue = pos.currentQueue ? await srvGetDetailQueue(pos.currentQueue): []
    const arrayProd = reArrangedPosDetail(sequence, pos, posDetail, createdBy, detailQueue, salesTax)

    const {
      totalPos, totalDPP, totalPPN, totalServices, totalProducts
    } = arrayProd.reduce((x, y) => ({
      totalPos: x.totalPos + (y.DPP + y.PPN),
      totalDPP: x.totalDPP + y.DPP,
      totalPPN: x.totalPPN + y.PPN,
      totalServices: x.totalProducts + (y.typeCode === 'P' ? 1 : 0),
      totalProducts: x.totalServices + (y.typeCode === 'S' ? 1 : 0)
    }), { totalPos: 0, totalDPP: 0, totalPPN: 0, totalProducts: 0, totalServices: 0 })
    // console.log('\n total', totalPos)
    // await getTotalPos(arrayProd)
    if (pos.discountLoyalty > 0 && !resultLoyalty) {
      await transaction.rollback()
      return next(new ApiError(422, 'Loyalty: Cannot use Discount, No Loyalty Program is running now'))
    }

    if (pos.discountLoyalty > totalPos) {
      await transaction.rollback()
      return next(new ApiError(422, 'Loyalty: discountLoyalty is bigger than total'))
    }

    if (resultLoyalty) {
      if (pos.discountLoyalty > resultLoyalty.maxDiscount) {
        await transaction.rollback()
        return next(new ApiError(422, 'Loyalty: Exceed Max Discount\ncurrent: resultLoyalty.maxDiscount'))
      }
    }

    if (pos.discountLoyalty > lastCashback.countCashback) {
      await updateMemberCashback(lastCashback.countCashback, pos.memberCode, transaction)
      await transaction.rollback()
      return next(new ApiError(422, 'Loyalty: Usage is bigger than current cashback please refresh'))
    }
    const gettingData = await countCashback(totalPos - pos.discountLoyalty, resultLoyalty || {})
    // posHeader
    let newResult = {}
    let newResultDetail = []
    const totalData = { total_dpp: totalDPP, total_ppn: totalPPN, total_netto: totalPos, total_services: totalServices, total_products: totalProducts }
    
    const result = await insertPosHeader({
      ...pos,
      user_agent,
      taxType: (salesTax.type || 'E'),
      taxVal: salesTax.percent,
      stat_tax_series: extensions.indexOf('tax-series') !== -1 ? '01' : '00',
      ...totalData
    },
      sequence, lastCashback.countCashback || 0, gettingData, createdBy, transaction
    )
    if(!result.success) throw result.message

    const resultDetail = await insertPosDetail(arrayProd, transaction)

    if(!resultDetail.success) throw resultDetail.message

    newResult = (JSON.parse(JSON.stringify(result.data)) || {})
    newResultDetail = (JSON.parse(JSON.stringify(resultDetail.data)) || [])

    // Start : Process Customer Achievement And Reward

    let achievementCustomers = []
    let rewardCustomers = []

    for (let z in posDetail) {
      const items = posDetail[z]
      const currTrans = (newResultDetail.filter(x => items.typeCode === x.typeCode && items.productId === x.productId)[0] || {})

      if(!!items.customerReward) {
        rewardCustomers.push({
          trans_id: newResult.id,
          item_id: currTrans.productId,
          trans_detail_id: currTrans.id,
          qty: currTrans.qty,
          type_code: currTrans.typeCode,
        })
      } else {
        achievementCustomers.push({
          trans_id: newResult.id,
          item_id: currTrans.productId,
          trans_detail_id: currTrans.id,
          qty: currTrans.qty,
          type_code: currTrans.typeCode,
        })
      }
    }

    if(rewardCustomers.length > 0) {
      // Insert coupon claim if rewardCustomer is selected.
      const claimCoupon = await srvCreateCouponClaim({
        store: newResult.storeId,
        member: newResult.memberCode,
        policeno: newResult.policeNoId,
        userName: createdBy,
        details: rewardCustomers
      }, transaction)

      if (!claimCoupon.success) {
        throw claimCoupon.message
      }
    }

    // insert and append customer point.
    const pointCoupon = await srvCreatePointHistory({
      store: newResult.storeId,
      member: newResult.memberCode,
      policeno: newResult.policeNoId,
      userName: createdBy,
      details: achievementCustomers
    }, transaction)

    if (!pointCoupon.success) {
      throw pointCoupon.message
    }

    // end : Process Customer Achievement And Reward

    
    // insert product trade-in
    if(Array.isArray(pos.tradeIn) && (pos.tradeIn || []).length > 0) {
      await srvCreateBulkBuyProductTradeIn(
        pos.tradeIn,
        {
          automate: ((additionalProps.tradeInSetting || {}).automate || {}),
          store: newResult.storeId,
          sales_no: sequence,
          times: moment(),
          users: createdBy
        },
        transaction
      )
    }
    
    const arrayBundling = await reArrangedBundling(posBundling, result.data, createdBy)
    await insertPosBundling(arrayBundling, transaction)
    let dataLoyalty
    let resultMemberCashback
    if (resultLoyalty && gettingData > 0) {
      dataLoyalty = await reArrangedCashbackIn(gettingData, pos, result.data, resultLoyalty, createdBy)
      resultMemberCashback = await insertCashback(dataLoyalty, transaction)
    }
    if (resultLoyalty && pos.discountLoyalty > 0) {
      dataLoyalty = await reArrangedCashbackOut(pos.discountLoyalty, pos, result.data, resultLoyalty, createdBy)
      resultMemberCashback = await insertCashback(dataLoyalty, transaction)
    }
    // update loyalty member
    if (pos.discountLoyalty > 0 || gettingData > 0) {
      await increaseMemberCashback(pos.discountLoyalty, gettingData, resultMemberCashback, lastCashback.countCashback, transaction)
    }
    const { data } = await createBulkPayment(pos.storeId, result.data.dataValues.id, pos.storeId, payment, createdBy, next, transaction)


    // insert warranty products
    if(((additionalProps.warrantyProduct || {}).active || '').toString() === 'true') {
      const createdWarranty = await srvCreateWarrantyProducts(
        {
          ...newResult,
          vehicle_km: pos.vehicle_km,
          policeNo: pos.policeNo,
          payments: JSON.stringify(data.listTypePayments || [])
        },
        newResultDetail,
        additionalProps.rulesWarranty,
        transaction,
      )
    }


    const lastSequence = await getDataByStoreAndCode('INV', pos.storeId)
    await increaseSequence('INV', pos.storeId, lastSequence.seqValue, transaction)
    
    if(increaseDuplicate) {
      const queryDuplicate = `select * from sch_pos.fn_insert_duplicate_spk(${pos.woId}, ${pos.storeId}, '${pos.currentQueue}') val`
      await getNativeQuery(queryDuplicate, true, 'RAW', null, transaction)
    }

    // delete queue if exists
    pos.currentQueue ? await srvDestroyByCondition({ storeid: pos.storeId, headerid: pos.currentQueue }, 'DONE', transaction) : null

    // would be filtered by setting store when it's must be generate a rating forms.

    if(typeof npsForm.active === 'boolean' && npsForm.active) {
      await generateRatingForm(notifSetting.WA, {
        branch_code: '',
        store_code: pos.storeCode,
        store_name: pos.storeName,
        trans_no: pos.transNo,
      })
    }

    await transaction.commit()
    return {
      discountLoyalty: pos.discountLoyalty || 0,
      lastCashback: lastCashback.countCashback || 0,
      gettingCashback: gettingData || 0,
      ...result.data.dataValues,
      resultInvoiceNo: sequence
    }
  } catch (error) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = error
    next(new ApiError(422, `Couldn't create ${transNo}.`, error))
  }
}

export function updatePos (id, pos, updatedBy, next) {
  return Pos.update({
    technicianId: pos.technicianId,
    memberCode: pos.memberCode,
    lastMeter: pos.lastMeter,
    paymentVia: pos.paymentVia,
    // policeNo: pos.policeNo,
    policeNoId: pos.policeNoId,
    woReference: pos.woReference,
    updatedBy: updatedBy
  },
    { where: { id: id } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

function updateStatusAndMemo (transNo, pos, updatedBy, transaction) {
  return Pos.update({
    status: pos.status,
    memo: pos.memo,
    updatedBy: updatedBy
  },
    {
      where: {
        transNo: transNo,
        storeId: pos.storeId
      },
      transaction
    }
  )
}

export async function syncMemberCashback (transNo, pos, updatedBy, next = null, transactionRef = null) {
  let transaction
  try {
    transaction = transactionRef ? transactionRef : await sequelize.transaction()
    const posDataHeader = await getPosByCode(transNo, pos.storeId)
    const { memberId } = posDataHeader
    const lastCashback = await getUserCashback(memberId)
    await updateMemberCashback(lastCashback.countCashback, memberId, transaction)
   !transactionRef ? await transaction.commit() : null

   return true
  } catch (error) {
    !transactionRef ? await transaction.rollback() : null
    const { parent, original, sql, ...other } = error
    if(next) {
      next(new ApiError(422, error + `Couldn't cancel ${transNo}.`, error))
    } else {
      throw new Error(`Couldn't cancel ${transNo}.`)
    }
  }
}

export async function cancelPos (transNo, pos, updatedBy, next) {
  let transaction
  try {
    transaction = await sequelize.transaction()
    const currentTime = moment()
    const dataApproval = { transno: transNo, storeid: pos.storeId, reqmemo: pos.memo }
    const processVoidApproval = await srvVoidSalesInvoice(dataApproval, updatedBy, currentTime, transaction)
    let retObj = {}
    if(!processVoidApproval.success) throw dataApproval.message
    if(processVoidApproval.success && processVoidApproval.active) {
      retObj = { success: true, message: 'Cancel Invoice need to be approved ...', approval: true, appvno: processVoidApproval.appvno }
    } else {
      const posDataHeader = await getPosByCode(transNo, pos.storeId)
      const { status, id, memberId, gettingCashback } = posDataHeader
      // ambil posDataHeader (id, storeId, lastCashback + gettingCashback - discountLoyalty)
      const dataCashBack = await getDataByPosId(id)
      let resultLoyalty
      if (dataCashBack) {
        resultLoyalty = {
          id: dataCashBack.loyaltyId,
          minPayment: dataCashBack.minPayment,
          maxDiscount: dataCashBack.maxDiscount,
          setValue: dataCashBack.loyaltySetValue
        }
      }
      let dataLoyalty = {}
      if (gettingCashback > 0, status === 'A' && pos.status === 'C') {
        if (dataCashBack) {
          dataLoyalty = await reArrangedCashbackOut(gettingCashback, { memberCode: memberId }, { dataValues: { id } }, resultLoyalty, updatedBy)
          const newDataLoyalty = {
            memo: `Cancel invoice ${transNo} - ${id}`,
            ...dataLoyalty
          }
          await insertCashback(newDataLoyalty, transaction)
          const lastCashback = await getUserCashback(memberId)
          await updateMemberCashback(lastCashback.countCashback - gettingCashback, memberId, transaction)
        }
      } else if (gettingCashback > 0, status === 'C' && pos.status === 'A') {
        if (dataCashBack) {
          dataLoyalty = await reArrangedCashbackIn(gettingCashback, { memberCode: memberId }, { dataValues: { id } }, resultLoyalty, updatedBy)
          const newDataLoyalty = {
            memo: `Activate invoice ${transNo} - ${id}`,
            ...dataLoyalty
          }
          await insertCashback(newDataLoyalty, transaction)
          const lastCashback = await getUserCashback(memberId)
          await updateMemberCashback(lastCashback.countCashback, memberId, transaction)
        }
      }
      await updateStatusAndMemo(transNo, pos, updatedBy, transaction)
      await syncMemberCashback(transNo, pos, updatedBy, null, transaction)
      retObj = { success: true, message: 'Invoice has been cancel.', approval: false }
    }

    await transaction.commit()
    return retObj
  } catch (error) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = error
    return { success: false, message: error + `Couldn't cancel ${transNo}.` }
  }
}

export function deletePos (posData) {
  return Pos.destroy({
    where: {
      transNo: posData
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deletePoses (poses) {
  if (!isEmpty(poses)) {
    return Pos.destroy({
      where: poses
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
