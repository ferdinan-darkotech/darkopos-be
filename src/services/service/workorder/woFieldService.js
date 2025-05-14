import { Op } from 'sequelize'
import db from '../../../models'
import dbv from '../../../models/view'
import sequelize from '../../../native/sequelize'
import { srvModifyRelationField } from './woMainService'

let table = db.tbl_wo_field
let vw_wo_field = dbv.vw_wo_field

const Fields = [
  'id',
  'fieldName',
  'sortingIndex',
  'fieldParentId',
  'fieldParentName',
  'typefields',
  'typevalue',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
]

const miniFields = [
  'id',
  'fieldName',
  'sortingIndex',
  'fieldParentId',
  'fieldParentName',
  'typefields',
  'typevalue',
  'jsongroups'
]

export function getDataId (id) {
  return table.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function getDataCode (data) {
  return table.findOne({
    where: {
      fieldName: data.fieldName,
      fieldParentId: data.fieldParentId,
      deletedBy: {
        [Op.eq]: null
      }
    },
    raw: false
  })
}

export function getDataFieldById (fieldid) {
  return table.findAll({
    where: { id: { [Op.in]: fieldid } },
    raw: true
  })
}

export function getDataCodeMax (data) {
  return table.findOne({
    attributes: [[sequelize.literal('max(sortingIndex)'), 'sortingIndex']],
    where: {
      deletedBy: {
        [Op.eq]: null
      }
    },
    raw: false
  })
}

export function dataExists (id) {
  return getDataId(id).then(exists => {
    if (exists == null) {
      return false;
    }
    else {
      return true;
    }
  })
}
export function dataExistsCode (code) {
  return getDataCode(code).then(exists => {
    if (exists == null) {
      return false
    }
    return true
  })
}

export function countData (query) {
  const { type, field, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { [Op.between]: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { [Op.iRegexp]: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'deletedBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vw_wo_field.count({
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        }
      },
    })
  } else {
    return vw_wo_field.count({
      where: {
        ...other,
        deletedBy: {
          [Op.eq]: null
        }
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'deletedBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vw_wo_field.findAll({
      attributes: [...Fields, 'relationid', 'usageperiod', 'usagemileage'],
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        }
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vw_wo_field.findAll({
      attributes: [...(query.field ? query.field.split(',') : miniFields), 'relationid', 'usageperiod', 'usagemileage'],
      where: {
        ...other,
        deletedBy: {
          [Op.eq]: null
        }
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export async function insertData (data, createdBy, next) {
  const transaction = await sequelize.transaction()
  try {
    const createdFields = await table.create({
      fieldName: data.fieldName,
      sortingIndex: data.sortingIndex,
      typefields: data.typefields,
      typevalue: data.typevalue,
      usageperiod: data.usageperiod,
      usagemileage: data.usagemileage,
      createdBy: createdBy,
      updatedBy: '---'
    }, { transaction, returning: ['id'] })
    const returningFields = JSON.parse(JSON.stringify(createdFields))

    await srvModifyRelationField(returningFields.id, data.relationid, createdBy, transaction)

    await transaction.commit()
    return { success: true, message: 'Data Field was created ...' } 
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

export async function updateData (id, data, updateBy) {
  const transaction = await sequelize.transaction()
  try {
    await table.update({
      fieldName: data.fieldName,
      sortingIndex: data.sortingIndex,
      // typefields: data.typefields,
      usageperiod: data.usageperiod,
      usagemileage: data.usagemileage,
      typevalue: data.typevalue,
      updatedBy: updateBy
    },
      {
        where: {
          id: id
        }
      }
    )

    await srvModifyRelationField(id, data.relationid, updateBy, transaction)

    await transaction.commit()
    return { success: true, message: 'Data Field was updated ...' } 
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

export function swapIndex (id, oldData, data, updateBy) {
  return table.update({
    sortingIndex: oldData.sortingIndex,
    updatedBy: updateBy
  },
    {
      where: {
        sortingIndex: data.sortingIndex,
        id: {
          [Op.ne]: id
        }
      }
    }
  )
}

export function deleteData (id, updateBy) {
  return table.update({
    deletedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}