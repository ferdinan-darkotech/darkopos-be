import dbv from '../../../models/viewR'
import db from '../../../models'
import { srvGetDataByCodeWithCustomeAttr } from '../setting/srvAccessGranted'
import { getNativeQuery } from '../../../native/nativeUtils'

const spkForm = dbv.vw_spk_form
const tblWO = db.tbl_wo
const customeConditionFields = dbv.mv_condition_wofields


// Local Function

function getConditionFields () {
  return customeConditionFields.findAll({
    attributes: ['*'],
    raw: true
  });
}

function getSpkForm (wono, storeid) {
  return spkForm.findOne({
    attributes: ['*'],
    raw: true,
    where: { wono, storeid }
  });
}


// Global Function
export function srvGetFormSPK (query, total_duplicate) {
  const sSql = `select * from sch_pos.fn_form_spk('${query.wono}', ${query.store}, ${query.duplicate}) val`
  const sSqlDuplicate = `select * from sch_pos.fn_form_spk_duplicate('${query.wono}', ${query.store}, ${query.duplicate}) val`
  const finalSql = +query.duplicate === +total_duplicate ? sSql : sSqlDuplicate
  return getNativeQuery(finalSql,false, 'RAW').then(result => {
    return { success: true, data: result[0][0].val }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}

export function srvUpdateDuplicateSPK (query) {
  return tblWO.update({
    current_duplicate: query.current + 1
  }, { where: { id: query.woid } })
}


// export function srvGetDataSPK (query) {
//   const customeFields = srvGetDataByCodeWithCustomeAttr('FIELDCUSTOMESPK', ['id','accesskey','accessvar01','accessvar03'])
//   const spkForm = getSpkForm(query.wono, query.store)
//   return Promise.all([customeFields, spkForm]).then(result => {
//     if (!result[1] || result[0].length === 0) {
//       throw new Error('No data found')
//     }
//     return { success: true, data: { customeFields: result[0], spk: result[1] } }
//   }).catch(er => {
//     return { success: false, message: er.message }
//   })
// }