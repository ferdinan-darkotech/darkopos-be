import db from '../../models'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { Op } from 'sequelize'

const table = db.tbl_target
const TargetStore = db.tbl_store
const TargetDetailBrand = db.tbl_target_detail_brand
const TargetDetailCategory = db.tbl_target_detail_category

table.belongsTo(TargetStore, { as: 'store', foreignKey: 'storeId', targetKey: 'id' })
table.hasMany(TargetDetailBrand, { as: 'brand', foreignKey: 'targetId', targetKey: 'id' })
table.hasMany(TargetDetailCategory, { as: 'category', foreignKey: 'targetId', targetKey: 'id' })

const storeField = ['storeCode', 'storeName', 'settingValue']
const include = [
  { model: TargetStore, as: 'store', attributes: storeField },
  { model: TargetDetailBrand, as: 'brand' },
  { model: TargetDetailCategory, as: 'category' }
]

const Fields = [
  'id',
  'storeId',
  'closing',
  'year',
  'description',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
]

export function getDataId (id, relationship) {
  return table.findOne({
    where: {
      id: id
    },
    include: Number(relationship) ? include : [
      { model: TargetStore, as: 'store', attributes: storeField }
    ],
  })
}

export function getDataCode (storeId, year) {
  return table.findOne({
    where: {
      storeId,
      year
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
export function dataExistsCode (storeId, code) {
  return getDataCode(storeId, code).then(exists => {
    if (exists == null) {
      return false
    }
    return true
  })
}

export function countData (query) {
  const { type, field, order, relationship, ...other } = query
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
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return table.count({
      where: {
        [Op.or]: querying
      }
    })
  } else {
    return table.count({
      where: {
        ...other
      }
    })
  }
}

export function getDataTarget (query) {
  return table.findAll({
    attributes: query.field ? query.field.split(',') : Fields,
    where: query,
    include
  })
}

export function getData (query, pagination) {
  const { type, field, order, relationship, ...other } = query

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
    return table.findAll({
      attributes: Fields,
      where: {
        [Op.or]: querying
      },
      include: Number(relationship) ? include : [
        { model: TargetStore, as: 'store', attributes: storeField }
      ],
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return table.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other
      },
      include: Number(relationship) ? include : [
        { model: TargetStore, as: 'store', attributes: storeField }
      ],
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

function createDataHeader (data, createdBy) {
  return table.upsert({
    storeId: data.storeId,
    year: data.year,
    description: data.description,
    createdBy: createdBy,
    updatedBy: createdBy
  }, { where: { storeId: data.storeId, year: data.year } })
}

function createDataBrand (data, transaction) {
  return TargetDetailBrand.bulkCreate(
    data,
    {
      fields: [
        'targetId',
        'brandId',
        'month',
        'targetSales',
        'targetSalesQty',
        'createdBy',
        'updatedBy',
        'deletedBy',
        'deletedAt'
      ],
      updateOnDuplicate: [
        'targetSales',
        'targetSalesQty',
        'updatedBy',
        'deletedBy',
        'deletedAt'
      ],
      transaction
    }
  )
}

function createDataCategory (data, transaction) {
  return TargetDetailCategory.bulkCreate(
    data,
    {
      fields: [
        'targetId',
        'categoryId',
        'month',
        'targetSales',
        'targetSalesQty',
        'createdBy',
        'updatedBy',
        'deletedBy',
        'deletedAt'
      ],
      updateOnDuplicate: [
        'targetSales',
        'targetSalesQty',
        'updatedBy',
        'deletedBy',
        'deletedAt'
      ],
      transaction
    }
  )
}

export async function insertData (data, createdBy, next) {
  let transaction
  try {
    transaction = await sequelize.transaction()

    await createDataHeader(data, createdBy)
    const insertData = await getDataCode(data.storeId, data.year)
    const closing = JSON.parse(insertData.closing || '[]') || []
    if (insertData) {
      if (data.brand) {
        await createDataBrand(
          data.brand
            .filter(f => !closing.includes(f.month))
            .map(x =>
              ({
                ...x,
                targetId: insertData.id,
                createdBy,
                updatedBy: createdBy,
                deletedBy: null,
                deletedAt: null
              })),
          transaction
        )
      }
      if (data.category) {
        await createDataCategory(
          data.category
            .filter(f => !closing.includes(f.month))
            .map(x =>
              ({
                ...x,
                targetId: insertData.id,
                createdBy,
                updatedBy: createdBy,
                deletedBy: null,
                deletedAt: null
              })),
          transaction
        )
      }
    }

    return transaction.commit()
  } catch (error) {
    transaction.rollback()
    const { parent, original, sql, ...other } = error
    next(new ApiError(422, error + `Couldn't create or update data.`, error))
  }
}

export function closingData (id, data, updateBy) {
  return table.update({
    closing: data.closing ? JSON.stringify(data.closing) : null,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function deleteData (id, next) {
  return table.destroy({
    where: {
      id: id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}