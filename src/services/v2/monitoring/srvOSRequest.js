import dbv from '../../../models/viewR'
import moment from 'moment'
import { setDefaultQuery } from '../../../utils/setQuery'

const dbvOsHeader = dbv.vw_request_order_os_header
const dbvOsDetail = dbv.vw_request_order_os_detail

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}

const attrHeader = [ 'id', 'storeid', 'storename', 'storeidreceiver', 'storenamereceiver', 'transno',
'transdate', 'categorycode', 'categoryname', 'transmemo' ]

const attrDetail = [ 'id', 'storeid', 'storename', 'storeidreceiver', 'storenamereceiver', 'transno',
'transdate', 'productid', 'productcode', 'productname', 'categorycode', 'categoryname', 'transmemo',
'qtyrequest', 'qtyprocess', 'qtyos', 'qtyonhandreceiver' ]


export function srvGetHeaderOsRequest (query) {
  const { m, storeid, ...other } = query
  const tmpAttr = tmpAttributes(attrHeader)
  const defaultQuery = setDefaultQuery(tmpAttr, other, false)
  defaultQuery.where = { ...defaultQuery.where, storeidreceiver: storeid }
  return dbvOsHeader.findAndCountAll({
    attributes: tmpAttr,
    raw: true,
    ...defaultQuery
  })
}

export function srvGetHeaderByTrans (transno) {
  const tmpAttr = tmpAttributes(attrHeader)
  return dbvOsHeader.findOne({
    attributes: tmpAttr,
    raw: true,
    where: { transno }
  })
}

export function srvGetDetailOsRequest (query) {
  const { m, storeid, type, ...other } = query
  let extendFilter = { storeid }
  if(type && type === 'out') extendFilter = { storeidreceiver: storeid }
  const tmpAttr = tmpAttributes(attrDetail)
  const defaultQuery = setDefaultQuery(tmpAttr, other, other.page ? true : false)
  defaultQuery.where = { ...defaultQuery.where, ...extendFilter }
  return dbvOsDetail.findAndCountAll({
    attributes: tmpAttr,
    ...defaultQuery,
    raw: true
  })
}


export function srvGetSomeDetailOsRequest (query) {
  const { store, trans } = query
  const tmpAttr = tmpAttributes(attrDetail)
  const where = { storeidreceiver: store, transno: trans }
  return dbvOsDetail.findAll({
    attributes: tmpAttr,
    where,
    raw: true
  })
}