import db from '../../../models'
import dbv from '../../../models/view'
import dbvr from '../../../models/viewR'
import { ApiError } from '../../../services/v1/errorHandlingService'
import sequelize from '../../../native/sequelize'
import { Op } from 'sequelize'

let table = db.tbl_wo_detail
let view = dbv.vw_wo_detail_002
let lastCheckedFields = dbvr.vw_last_checked_fields

const Fields = ['id', 'woId', 'detailId', 'fieldName', 'sorting', 'sortingIndex', 'fieldParentId', 'fieldParentName', 'value', 'memo']
const fieldsCheckdFields = [
  'memberid', 'membercode', 'membername', 'policenoid', 'policeno', 'fieldid',
  'fieldname', 'value', 'condition', 'memo', 'lastchecked', 'lastcheckedkm'
]

// New syntax 2020-10-19 : to fetch last data service
export function srvGetLastFieldsChecked (membercode, policeno) {
  return lastCheckedFields.findAll({
    attributes: fieldsCheckdFields,
    where: { membercode, policeno },
    raw: true
  })
}
// by afx98


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
      woId: data.woId,
      fieldId: data.fieldId,
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
      query[key] = { between: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { [Op.iRegexp]: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view.count({
      where: {
        [Op.or]: querying
      },
    })
  } else {
    return view.count({
      where: {
        ...other
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
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view.findAll({
      attributes: Fields,
      where: {
        [Op.or]: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function insertDataDetailBulk (custome = [], info, transaction) {
  console.log('\n')
  console.log('>>>', custome)
  console.log('\n')
  let newData = []
  for(let x in custome) {
    const data = custome[x]
    if(data.condition) {
      newData.push({
        woId: info.woId,
        fieldId: data.id,
        value: data.value,
        memo: data.memo,
        condition: data.condition,
        richvalues: data.richvalues,
        createdBy: info.createdBy,
        createdAt: info.time
      })
    }
  }

  return table.bulkCreate(newData, { transaction })
}

export function insertData (data, createdBy, time) {
  return table.create({
    woId: data.woId,
    fieldId: data.fieldId,
    value: data.value,
    memo: data.memo,
    condition: data.condition,
    richvalues: data.richvalues,
    createdBy: createdBy,
    createdAt: time
  })
}

export function updateData (id, data, updateBy, time) {
  return table.update({
    woId: data.woId,
    fieldId: data.fieldId,
    value: data.value,
    memo: data.memo,
    condition: data.condition,
    richvalues: data.richvalues,
    updatedBy: updateBy,
    updatedAt: time
  },
    {
      where: {
        id: id
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