import db from '../../../models/tableR'
import dbv from '../../../models/viewR'
import { setDefaultQuery } from '../../../utils/setQuery'
import { getDataByStoreAndCode, increaseSequence } from '../../sequencesService'
import { getSequenceFormatByCode } from '../../sequenceService'
import { getNativeQuery } from '../../../native/nativeUtils'
import sequelize from '../../../native/sequelize'
import moment from 'moment'
import { Op } from 'sequelize'

const cashEntry = db.tbl_cash_entry
const cashEntryDetail = db.tbl_cash_entry_detail
const vwCashEntryHeader = dbv.vw_cash_entry
const vwCashEntryDetail = dbv.vw_cash_entry_detail
const vwSRCashEntry = dbv.vw_summary_report_cash_entry


const attributeHeader = [
  'storeid', 'storecode', 'storename', 'transno', 'transdate', 'transtypecode', 'transtypename',
  'transkindcode', 'transkindname', 'cashierid', 'cashiername', 'description', 'status', 'createdBy',
  'createdAt', 'updatedBy', 'updatedAt'
]

const attributeDetail = [
  'id', 'storeid', 'storecode', 'storename', 'transno', 'coacode', 'coaname', 'divcode', 'divname',
  'deptcode', 'deptname', 'description', 'balance', 'status', 'createdBy', 'createdAt', 'updatedBy',
  'updatedAt'
]

const attributeReportSummary = [ 
  'storecode', 'storename', 'transno', 'transdate', 'transtypecode', 'transtypename', 'transkindcode',
  'transkindname', 'cashierid', 'cashiername', 'description', 'totalbalance'
]

// START : LOCAL FUNCTION
function insertHeaderCashEntry (data, info, transaction) {
  return cashEntry.create({
    storeid: info.storeid,
    transno: info.transno,
    transdate: data.transdate,
    transtype: data.transtype,
    transkind: data.transkind,
    status: data.status,
    description: data.description,
    cashierid: data.cashierid,
    createdat: info.time,
    createdby: info.user
  }, { transaction, returning: ['*'] })
}

function insertDetailCashEntry (detail, info, transaction) {
  const newData = detail.map(x => ({
    transno: info.transno,
    storeid: info.storeid,
    coacode: x.coacode,
    divcode: x.divcode,
    deptcode: x.deptcode,
    // status: x.status,
    balance: x.balance,
    description: x.description,
    createdat: info.time,
    createdby: info.user
  }))
  return cashEntryDetail.bulkCreate(newData, { transaction })
}


function updateHeaderCashEntry (data, info, clause, transaction) {
  return cashEntry.update({
    transkind: data.transkind,
    status: data.status,
    description: data.description,
    updatedat: info.time,
    updatedby: info.user
  }, { where: { storeid: clause.storeid, transno: clause.transno } }, { transaction })
}

async function updateDetailCashEntry (detail, info, clause, transaction) {
  try {
    let toInsert = []
    for(let x in detail) {
      const tmpData = {
        coacode: detail[x].coacode,
        divcode: detail[x].divcode,
        // status: detail[x].status,
        deptcode: detail[x].deptcode,
        balance: detail[x].balance,
        description: detail[x].description
      }
      const updatedData = await cashEntryDetail.update(
        { ...tmpData, updatedat: info.time, updatedby: info.user },
        { where: { storeid: clause.storeid, transno: clause.transno, id: detail[x].id } },
        { transaction, returning: ['*'] }
      )
      if(updatedData[0] === 0) {
        toInsert.push({ ...tmpData, transno: clause.transno, storeid: clause.storeid, createdat: info.time, createdby: info.user })
      }
    }
    if(toInsert.length > 0) {
      await cashEntryDetail.bulkCreate(toInsert, { transaction })
    }
    return { success: true, message: 'Detail updated' }
  } catch (er) {
    return { success: false, message: er.message, detail: er.detail }
  }
}

// END : LOCAL FUNCTION


// START : GLOBAL FUNCTION
export function srvGetOneHeaderCashEntry (storeid, transno) {
  return vwCashEntryHeader.findOne({
    attributes: attributeHeader,
    where: { storeid, transno },
    raw: true
  })
}

export function srvGetHeaderCashEntry (query, condPeriod = []) {
  const { m, storeid, ...other } = query
  let queryDefault = setDefaultQuery(attributeHeader, other, true)
  queryDefault.where = { ...queryDefault.where, storeid, [Op.or]: condPeriod }
  return vwCashEntryHeader.findAndCountAll({
    attributes: attributeHeader,
    ...queryDefault,
    raw: true
  })
}

export function srvGetAllDetailCashEntry (storeid, transno) {
  return vwCashEntryDetail.findAll({
    attributes: attributeDetail,
    where:{
      storeid,
      transno 
    },
    raw: true
  })
}

export async function srvCreateCashEntry (data, detail, user, next) {
  let transaction = await sequelize.transaction()
  try {
    const typeCode = `CE${data.transtypecode}`
    let sequence = await getSequenceFormatByCode({ seqCode: typeCode, type: data.storeid }, next)
    const info = {
      storeid: data.storeid,
      transno: sequence,
      time: moment(),
      user
    }
    const createdHeader = await insertHeaderCashEntry(data, info, transaction)
    const createdDetail = await insertDetailCashEntry(detail, info, transaction)
    const lastSequence = await getDataByStoreAndCode(typeCode, data.storeid)

    const headerData = JSON.parse(JSON.stringify(createdHeader))
    await increaseSequence(typeCode, data.storeid, lastSequence.seqValue, transaction)
    await transaction.commit()
    return { success: true, message: 'Data has been created', transno: sequence }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: 'Error when saving data', detail: er.message }
  } 
}

export async function srvUpdateCashEntry (data, detail, user) {
  let transaction = await sequelize.transaction()
  try {
    const info = {
      storeid: data.storeid,
      transno: data.transno,
      time: moment(),
      user
    }
    const clause = {
      storeid: data.storeid,
      transno: data.transno
    }
    const updatedHeader = await updateHeaderCashEntry(data, info, clause, transaction)
    const updatedDetail = await updateDetailCashEntry(detail, info, clause, transaction)
    await transaction.commit()
    return { success: true, message: 'Data has been created', transno: data.transno }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: 'Error when saving data', detail: er.message }
  } 
}

export async function srvGetSummaryCashEntry (transkind = null, query) {
  const {
    store = '',
    cashier = [],
    startat,
    endat
  } = query
  const newStartAt = startat ? moment(startat).format('YYYY-MM-DD') : null
  const newEndAt = startat ? moment(endat).format('YYYY-MM-DD') : null

  const sSql = `select * from sch_pos.fn_report_cash_entry('${store}', '${newStartAt}', '${newEndAt}', '${transkind}')`
  return getNativeQuery(sSql, true, 'RAW')
  
  
  // vwSRCashEntry.findAll({
  //     attributes: attributeReportSummary,
  //     where: {
  //       storecode: store,
  //       ...(cashier ? { cashierid: cashier } : {}),
  //       transdateval: { [Op.between] [newStartAt, newEndAt] },
  //       transkindcode: transkind
  //     },
  //     raw: true
  // })
}

// END : GLOBAL FUNCTION












