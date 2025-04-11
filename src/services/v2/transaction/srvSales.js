import db from '../../../models'

const tbPos = db.tbl_pos


export function srvGetPendingTaxSeries (store) {
  return tbPos.findAll({
    attributes: [['transno', 'trans_no'], ['transdate', 'trans_date']],
    where: {
      status: 'A',
      stat_tax_series: '02',
      storeid: store
    },
    order: ['createdat'],
    raw: true
  })
}

export function srvRegenerateTaxSeries (store, invoice) {
  return tbPos.update({
    stat_tax_series: '01'
  }, {
      where: { storeid: store, transno: invoice },
      raw: true,
      returning: ['*']
  })
}