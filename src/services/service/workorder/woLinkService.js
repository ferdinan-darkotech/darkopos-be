import { Op } from 'sequelize'
import dbr from '../../../models/tableR'
import moment from 'moment'

let linkField = dbr.tbl_link_wo_field

// relation field

export function srvGetAllRelation (fieldId) {
  return linkField.findAll({
    attributes: ['id', 'linktype', 'target', 'deletedby'],
    where: {
      fieldid: fieldId
    },
    raw: true
  })
}

export function srvGetAllRelationByField (fieldId) {
  return linkField.findAll({
    attributes: ['fieldid', 'linktype', 'target'],
    where: {
      fieldid: fieldId,
      deletedAt: { [Op.eq]: null }
    },
    raw: true
  })
}

export async function srvModifylinkField (fieldId, listRelationId = [], user, transaction) {
  try {
    const times = moment()
    let toAdded = []
    let toDisabled = []
    let toEnabled = []

    for (let x in listRelationId) {
      const items = listRelationId[x]
      if(items.mode === 'add') {
        toAdded.push({
          fieldid: fieldId,
          linktype: items.linktype,
          target: items.target,
          createdBy: user,
          createdAt: times
        })
      } else if (items.mode === 'disabled') {
        toDisabled.push(items.id)
      } else if (items.mode === 'enabled') {
        toEnabled.push(items.id)
      }
    }

    if(toAdded.length > 0) await linkField.bulkCreate(toAdded, { transaction })
    if(toDisabled.length > 0) {
      await linkField.update({
        deletedBy: user,
        deletedAt: moment()
      }, { where: { fieldid: fieldId, id: { [Op.in]: toDisabled } } }, { transaction })
    }
    if(toEnabled.length > 0) {
      await linkField.update({
        deletedBy: null,
        deletedAt: null
      }, { where: { fieldid: fieldId, id: { [Op.in]: toEnabled } } }, { transaction })
    }
  } catch (er) {
    throw new Error(er.message)
  }
}
