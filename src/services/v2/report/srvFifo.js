import dbv from "../../../models/viewR"
import sequelize from '../../../native/sequelize'

const vwRecapFifo = dbv.vw_rekap_stock_fifo
const attrRecapFifo = [
  'storeId',"storeCode",'storeName','periode','period','year','productId','productCode','productName','active','beginQty','beginPrice',
  'purchaseQty','adjInQty','adjInPrice','adjOutQty','adjOutPrice','posQty','posPrice','transferInQty','transferInPrice','transferOutQty',
  'transferOutPrice','inTransferQty','inTransferPrice','inTransitQty','inTransitPrice'
]



export function srvGetRecapStockFifo (query, userid) {
  const { options, ...other } = query
  
  let queryString = `
    select * from sch_pos.vw_rekap_stock_fifo where storeid::text = :store and periode = :periode 
  `

  if (options) {
    queryString = `
      select storeid, "storeName", periode from sch_pos.vw_rekap_stock_fifo x
      inner join sch_pos.tbl_user_store y on x.storeid = y.userstoreid
      where y.userid = :userid
      group by storeid, "storeName", periode order by storeid, "storeName", periode
    `
  }

  return sequelize.query(queryString,
  { replacements: { periode: other.periode, store: other.store, userid: userid } })
  // return vwRecapFifo.findAndCountAll({
  //   attributes: attrRecapFifo,
  //   where: {
  //     storeId: query.store,
  //     periode: query.periode
  //   },
  //   raw: true
  // })
}