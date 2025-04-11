import moment from 'moment'
import { buildAttributesOfNoSql } from '../../../utils/setQuery'
import shortid from 'shortid'
import sequelize from '../../../native/sequelize'
import tb from '../../../models/tableR'

const pendingWO = tb.tbl_pending_wo

const attrPendingWO = {
  mf: [
    'record_id', 'store', 'member', 'unit', 'trans_header', 'trans_detail', 'other_informations',
    'verified_wa_number', 'workorder', 'created_by', 'created_at'
  ],
  mnf: [
    'record_id', 'store', 'member', 'unit', 'verified_wa_number', 'created_by', 'created_at'
  ]
}

export async function srvInsertPendingWO(dataArray) {
  const transaction = await sequelize.transaction();
  try {
    const makePendingWO = await pendingWO.bulkCreate(
      dataArray.map(data => ({
        record_id: shortid.generate(),
        store: data.store,
        member: data.member,
        unit: data.unit,
        verified_wa_number: !data.contact ? null : data.contact.toString(),
        trans_header: data.trans_header,
        trans_detail: data.trans_detail,
        other_informations: data.other_informations,
        workorder: data.workorder,
        created_by: data.created_by,
        created_at: data.created_at
      })),
      { transaction }
    );
    await transaction.commit();

    return makePendingWO;
  } catch (er) {
    await transaction.rollback();
    throw er.message;
  }
}

export async function srvGetListPendingWO(store = null) {
  const attributes = buildAttributesOfNoSql(attrPendingWO.mf, attrPendingWO.mnf, true);
  return await pendingWO.findAll({
    where: { store },
    attributes: Object.keys(attributes).filter(key => attributes[key] === 1),
  });
}

export async function srvGetPendingWO(record_id = null) {
  const attributes = buildAttributesOfNoSql(attrPendingWO.mf, attrPendingWO.mf, true);
  return await pendingWO.findOne({
    where: { record_id },
    attributes: Object.keys(attributes).filter(key => attributes[key] === 1),
  });
}

export async function srvDeletePendingWO(record_id = null) {
  try {
    return await pendingWO.destroy({
      where: { record_id }
    });
  } catch (er) {
    throw er.message;
  }
}