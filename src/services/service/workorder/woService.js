import db from '../../../models'
import dbv from '../../../models/view'
import dbvr from '../../../models/viewR'
import sequelize from '../../../native/sequelize'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { getNativeQuery } from '../../../native/nativeUtils'
import moment from 'moment'
import { Op } from 'sequelize'

const table = db.tbl_wo
const tableWoDetail = db.tbl_wo_detail
const tableWoCheck = db.tbl_wo_check

const view001 = dbv.vw_wo_001
const vwMainWO = dbvr.vw_main_wo
const vwWoDetail = dbvr.vw_wo_detail

// [NEW]: FERDINAN - 2025-03-03
const vwWO = dbvr.vw_wo

const Fields = [
  'id',
  'storeId',
  'woNo',
  'woDate',
  'woReference',
  'transNo',
  'transDate',
  'cashierName',
  'technicianName',
  'address01',
  'memberTypeId',
  'memberTypeName',
  'memberSellPrice',
  'showAsDiscount',
  'memberPendingPayment',
  'gender',
  'mobileNumber',
  'phoneNumber',
  'memberId',
  'memberCode',
  'memberName',
  'cashback',
  'policeNoId',
  'policeNo',
  'merk',
  'model',
  'type',
  'year',
  'expired',
  'chassisNo',
  'machineNo',
  'takeAway',
  'timeIn',
  'timeOut',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
]

const attrMainWo = ['id','woNo','storeId','memberId','policeNoId','timeIn','takeAway','storeCode','storeName','memberCode','memberName',
'policeNo','merk','model','type','chassisNo','machineNo','year','createdBy','createdAt','updatedBy',
'updatedAt','deletedBy','deletedAt', 'pendingpayment', 'showasdiscount', 'discnominal', 'discpct01', 'timeIn',
'discpct02', 'discpct03', 'sellprice', 'cashback', 'membertypeid', 'membertypename', 'status', 'transDate', 'woDate']

const woDetailAttribute = [
  ['id', 'woid'], 'wono', 'storeid', 'storecode', 'storename', 'memberid', 'membercode', 'membername', 'timein',
  'gasoline_percent', 'vehicle_km', 'takeaway', 'policenoid', 'policeno', 'current_duplicate', 'total_duplicate'
]

// [NEW]: FERDINAN - 2025-03-03
const woDetailAttributeNew = [
  ['id', 'woid'], 'wono', 'storeid', 'storecode', 'storename', 'memberid', 'membercode', 'membername', 'memberpendingpayment', 'membersellprice', 'membertypeid', 'showasdiscount', 'timein',
  'gasoline_percent', 'vehicle_km', 'takeaway', 'policenoid', 'policeno', 'current_duplicate', 'total_duplicate', 'noreference', 'drivername',

  // [STATUS VEHICLE]: FERDINAN - 2025/07/01
  'statusvehicle'
]

// Normalization query to database, at : 18-Nov-2022
export async function srvGetWoDetail (woid, query) {
  const newWhere = +woid === -1 ? { wono: query.wono } : { id: woid }
  try {
    // let dataWO =  await vwMainWO.findOne({
    //   attributes: woDetailAttribute,
    //   where: newWhere,
    //   raw: true
    // })

    // [NEW]: FERDINAN - 2025-03-03
    let dataWO =  await vwWO.findOne({
      attributes: woDetailAttributeNew,
      where: newWhere,
      raw: true
    })

    if(dataWO) {
      const woCustome = await tableWoDetail.findAll({
        attributes: ['memo', 'value', 'fieldid', 'condition', 'lastchecked', 'richvalues'],
        where: { woid: dataWO.woid },
        raw: true
      })

      const woChecks = await tableWoCheck.findAll({
        attributes: ['memo', 'value', 'checkid'],
        where: { woid: dataWO.woid },
        raw: true
      })

      dataWO.checks = woChecks
      dataWO.custome = woCustome  
    }

    return dataWO
  } catch (er) {
    throw new Error(er.message)
  }
}

export function getDataId (id) {
  return vwMainWO.findOne({
    where: {
      id: id
    },
    paranoid: false,
    raw: false
  })
}

export function getDataCode (id) {
  return table.findOne({
    where: {
      id: id
    },
    paranoid: false,
    raw: false
  })
}

export function getMinutesCreatedForMember (data) {
  return table.findOne({
    where: {
      createdAt: {
        [Op.gte]: sequelize.literal(`now() - interval '5 minute'`)
      },
      memberId: data.memberId,
      policeNoId: data.policeNoId,
      deletedBy: {
        [Op.eq]: null
      }
    },
    raw: false
  })
}

export function getWoById (id) {
  return view001.findOne({
    attributes: Fields,
    where: {
      id: id
    },
    raw: false
  })
}

export function getWoByNoAndStore (wono, storeid) {
  return table.findOne({
    attributes: ['storeid', 'id', 'wono', 'timein', 'total_duplicate', 'current_duplicate'],
    where: {
      wono,
      storeid
    },
    raw: false
  })
}

export function getWoByNo (wono) {
  return view001.findOne({
    attributes: Fields,
    where: {
      wono
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
  const { type, field, order, q, store, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    } else if (type !== 'all' && query['q']) {
      if(query['q'] !== 'storeId') {
        query[key] = { [Op.iRegexp]: query[key] }
      } else {
        query[key] = query['q']
      }
      
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if ((
          id === 'woNo' || id === 'woReference' || id === 'transNo' || id === 'cashierName' ||
          id === 'phoneNumber' || id === 'mobileNumber' || id === 'memberTypeName' || id === 'address01' || id === 'technicianName' ||
          id === 'memberCode' || id === 'memberName' || id === 'policeNo' || id === 'chassisNo' || id === 'machineNo'
        )) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }

  if (querying.length > 0) {
    return view001.count({
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        },
        storeId: store
      },
    })
  } else {
    return view001.count({
      where: {
        ...other,
        deletedBy: {
          [Op.eq]: null
        },
        storeId: store
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, q, store, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    }
  }

  
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if ((
        id === 'woNo' || id === 'woReference' || id === 'transNo' || id === 'cashierName' ||
        id === 'phoneNumber' || id === 'mobileNumber' || id === 'memberTypeName' || id === 'address01' || id === 'technicianName' ||
        id === 'memberCode' || id === 'memberName' || id === 'policeNo' || id === 'chassisNo' || id === 'machineNo'
      )) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view001.findAll({
      attributes: Fields,
      where: {
        [Op.or]: [ querying ],
        deletedBy: {
          [Op.eq]: null
        },
        storeId: store
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view001.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other,
        deletedBy: {
          [Op.eq]: null
        },
        storeId: store
      },
      order: order ? sequelize.literal(order) : [['createdAt', 'DESC']],
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}


export function getDataMainWo (query, pagination) {
  const { type, field, order, q, store, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    }
  }

  
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in attrMainWo) {
      const id = Object.assign(attrMainWo)[key]
      if ((
        id === 'woNo' || id === 'memberCode' || id === 'memberName' || id === 'policeNo' ||
        id === 'chassisNo' || id === 'machineNo'
      )) {
        let obj = {}
        obj[id] = { [Op.iRegexp]: query['q'] }
        querying.push(obj)
      }
    }
  }
  
  // [NEW]: FERDINAN - 2025-03-03
  if (querying.length > 0) {
    return vwWO.findAndCountAll({
      // attributes: attrMainWo,
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        },
        storeId: store,
        ...(query.wo_status ? { wo_status: query.wo_status } : {})
      },
      order: [['woNo', 'DESC']],
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vwWO.findAndCountAll({
      // attributes: attrMainWo,
      where: {
        ...other,
        deletedBy: {
          [Op.eq]: null
        },
        storeId: store,
        ...(query.wo_status ? { wo_status: query.wo_status } : {})
      },
      order: order ? sequelize.literal(order) : [['woNo', 'DESC']],
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }

  
  // [NEW]: FERDINAN - 2025-03-03
  // if (querying.length > 0) {
  //   return vwMainWO.findAndCountAll({
  //     attributes: attrMainWo,
  //     where: {
  //       [Op.or]: querying,
  //       deletedBy: {
  //         [Op.eq]: null
  //       },
  //       storeId: store
  //     },
  //     order: [['createdAt']],
  //     limit: parseInt(pageSize || 10, 10),
  //     offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  //   })
  // } else {
  //   return vwMainWO.findAndCountAll({
  //     attributes: attrMainWo,
  //     where: {
  //       ...other,
  //       deletedBy: {
  //         [Op.eq]: null
  //       },
  //       storeId: store
  //     },
  //     order: order ? sequelize.literal(order) : null,
  //     limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
  //     offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
  //   })
  // }
}


export function insertData (data, createdBy, next) {
  return table.create({
    storeId: data.storeId,
    woNo: data.woNo,
    timeIn: data.timeIn,
    memberId: data.memberId,
    policeNoId: data.policeNoId,
    takeAway: data.takeAway,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function modifyDataCustomeFieldsWO (woid, data, updateBy, transaction) {
  const queryUpdated = `select * from sch_pos.fn_modify_wo_detail(${woid}, '${JSON.stringify(data)}', '${updateBy}') val`
  return getNativeQuery(queryUpdated, true, 'RAW', null, transaction)
}

export function modifyDataChecksFieldsWO (woid, data, updateBy, transaction) {
  const queryUpdated = `select * from sch_pos.fn_modify_wo_checks(${woid}, '${JSON.stringify(data)}', '${updateBy}') val`
  return getNativeQuery(queryUpdated, true, 'RAW', null, transaction)
}


export async function updateData (id, data, updateBy, isChange = false, headerid) {
  const { header, storeid, ...other } = data
  const transaction = await sequelize.transaction()
  const timeAt = moment()
  try {
    const headerUpdated = await table.update({
      takeAway: header.takeAway,
      updatedBy: updateBy,
      updatedAt: timeAt,
      vehicle_km: header.vehicle_km,
      gasoline_percent: header.gasoline_percent,
      takeAway: +header.takeAway,

      // [NEW]: FERDINAN - 2025-03-07
      drivername: header.drivername || '-',
      noreference: header.noreference || '-',

      // [STATUS VEHICLE]: FERDINAN - 2025/07/01
      statusvehicle: header.statusvehicle
    },
      {
        where: {
          id: id,
          storeid
        }
      },
      transaction
    )
    
    const customeDetailModifier = await modifyDataCustomeFieldsWO(header.woid, other.custome, updateBy, transaction)
    const checksModifier = await modifyDataChecksFieldsWO(header.woid, other.check, updateBy, transaction)
    if(isChange) {
      const queryDuplicate = `select * from sch_pos.fn_insert_duplicate_spk(${header.woid}, ${storeid}, '${headerid}') val`
      await getNativeQuery(queryDuplicate, true, 'RAW', null, transaction)
    }
    await transaction.commit()
    return { message: 'WO has been updated', success: true, detail: customeDetailModifier[0][0].val, checks: checksModifier[0][0].val }
  } catch (er) {
    await transaction.rollback()
    return { message: er.message, success: false }
  }
}

function deleteUpdateData (id, updateBy, transaction) {
  return table.update({
    deletedBy: updateBy
  },
    {
      where: {
        id: id
      },
      transaction
    }
  )
}

function destroyData (id, transaction) {
  return table.destroy({
    where: {
      id: id
    },
    transaction
  })
}

export async function deleteData (id, updateBy, next) {
  let transaction
  try {
    transaction = await sequelize.transaction()
    const update = await deleteUpdateData(id, updateBy, transaction)
    await destroyData(id, transaction)
    await transaction.commit()
    return update
  } catch (error) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = error
    next(new ApiError(422, error + `Couldn't delete wo.\n`, error))
  }
}