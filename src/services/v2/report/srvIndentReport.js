import { Op } from 'sequelize'
import dbv from '../../../models/viewR'
import { getNativeQuery } from '../../../native/nativeUtils'
import moment from 'moment'


const vwIndent = dbv.vw_indent
const vwIndentDetail = dbv.vw_indent_detail
const vwReportReturIndent = dbv.vw_report_retur_indent
const vwReportReturIndentDetail = dbv.vw_report_retur_indent_detail

const attrRecapIndent = [
	'storename', 'transno', 'transdate', 'reference', 'duedate', 'dpin_dpp', 'dpin_ppn',
  'dpout_dpp', 'dpout_ppn', 'employeecode', 'employeename', 'membercode', 'membername', 'dpcost',
  'dpretur', 'dpused', 'totalitem', 'description'
]

const attrDetailIndent = [
  'storename', 'transno', 'transdate', 'productcode', 'productname',
  ['currqty', 'remainingqty'], 'returqty', 'receiveqty', 'description', 
]

const attrRecapReturIndent  = [
  'indentno', 'cancelno', 'dpretur', 'totalreturqty', 'indentdate', 'cancelat',
  'storecode', 'storename', 'description', 'cancelbycode', 'cancelbyname'
]

const attrDetailReturIndent  = [
  'indentno', 'cancelno', 'productcode', 'productname', 'storecode',
  'storename', 'returqty', 'cancelbycode', 'cancelbyname', 'cancelat'
]

export function srvRecapReportIndent ({ fromDate = '', toDate = '', stores = [], sortBy = ['transdate'] }) {
  return vwIndent.findAll({
    attributes: attrRecapIndent,
    where: {
      [Op.or]: [{ transdate: { [Op.gte]: fromDate } }, { transdate: { [Op.lte]: toDate } }, { storecode: { [Op.in]: stores } }]
    },
    order: sortBy
  })
}

export function srvDetailReportIndent ({ fromDate = '', toDate = '', stores = [], sortBy = ['transdate'] }) {
  return vwIndentDetail.findAll({
    attributes: attrDetailIndent,
    where: {
      [Op.or]: [{ transdate: { [Op.gte]: fromDate } }, { transdate: { [Op.lte]: toDate } }, { storecode: { [Op.in]: stores } }]
    },
    order: sortBy
  })
}

export function srvRecapReportReturIndent ({ fromDate = '', toDate = '', stores = [], sortBy = ['cancelat'] }) {
  return vwReportReturIndent.findAll({
    attributes: attrRecapReturIndent,
    where: {
      [Op.or]: [{ cancelat: { [Op.gte]: fromDate } }, { cancelat: { [Op.lte]: toDate } }, { storecode: { [Op.in]: stores } }]
    },
    order: sortBy
  })
}

export function srvDetailReportReturIndent ({ fromDate = '', toDate = '', stores = [], sortBy = ['cancelat'] }) {
  return vwReportReturIndentDetail.findAll({
    attributes: attrDetailReturIndent,
    where: {
      [Op.or]: [{ cancelat: { [Op.gte]: fromDate } }, { cancelat: { [Op.lte]: toDate } }, { storecode: { [Op.in]: stores } }]
    },
    order: sortBy
  })
}