import sequelize from '../../native/sequelize'
import db from '../../models'
import dbr from '../../models/tableR'
import dbv from '../../models/viewR'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import { getSequenceFormatByCode } from '../sequenceService'
import { getDataByStoreAndCode, increaseSequence } from '../sequencesService'
import { getSettingByCode } from '../settingService'
import { srvGetStoreBranch } from '../v2/master/store/srvStore'
import moment from 'moment'
import { Op } from 'sequelize'

const Service = db.tbl_service
const utilityService = dbr.tbl_spr_service
const vwService = dbv.vw_spr_service



const serviceField = ['id', 'serviceCode', 'serviceName', 'cost', 'serviceCost', 'reminder_in_day', 'reminder_in_km',
  'serviceTypeId', 'active', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const searchQuery = [
  'serviceCode', 'serviceName', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
//getServiceByCode,
export function getServiceByCode (serviceCode, regID) {
  return vwService.findOne({
    where: {
      serviceCode: serviceCode,
      reg_id: regID
    },
    raw: false
  })
}

export async function getSomeServiceByCode (serviceCode, store) {
  try {
    const currBranch = await srvGetStoreBranch(store)

    if(currBranch) {
      return vwService.findAll({
        attributes: serviceField,
        where: {
          reg_id: currBranch.parent_store_id,
          serviceCode: { [Op.in]: serviceCode }
        },
        raw: false
      })
    } else {
      return []
    }
  } catch (er) {
    throw new Error(er.message)
  }
}

export function getSomeServiceByCodeReg (serviceCode, regID) {
  return vwService.findAll({
    attributes: serviceField,
    where: {
      reg_id: regID,
      serviceCode: { [Op.in]: serviceCode }
    },
    raw: false
  })
}

export function countData (query) {
  const { type, order, q, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { [Op.between]: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { [Op.iRegexp]: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in searchQuery) {
      const id = Object.assign(searchQuery)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'type')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwService.count({
      where: {
        [Op.or]: querying,
        [Op.and]: other
      },
    })
  } else {
    return vwService.count({
      where: {
        ...other
      }
    })
  }
}

export function getServicesData (query, pagination) {
  const { type, order, q = '', reg_id, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  
  return vwService.findAndCountAll({
    attributes: serviceField,
    where: {
      [Op.or]: [{ servicecode: { [Op.iRegexp]: q } }, { servicename: { [Op.iRegexp]: q } }],
      [Op.and]: { ...other, reg_id }
    },
    order: [['serviceCode', 'DESC']],
    limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
    offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
  })
}

export function setServiceInfo (request) {
  const getServicesInfo = {
    id: request.id,
    serviceCode: request.serviceCode,
    serviceName: request.serviceName,
    cost: request.cost,
    serviceCost: request.serviceCost,
    serviceTypeId: request.serviceTypeId
  }

  return getServicesInfo
}

export function serviceExists (serviceCode) {
  return getServiceByCode(serviceCode).then(service => {
    if (service == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

// export function validateMember (membercode, member, createdBy, next) {
//   if (memberGroupExists(member.memberGroup)) {
//     return true
//   } else {
//     return false
//   }
//
// }




function insertDataUtilityService (service, timeNow, createdBy, transaction) {
  return utilityService.create({
    reg_id: service.reg_id,
    service_id: service.id,
    cost: parseFloat(service.cost),
    service_cost: parseFloat(service.serviceCost),
    reminder_in_day: service.reminder_in_day,
    reminder_in_km: service.reminder_in_km,
    active: !!service.active,
    sync_by: createdBy,
    sync_at: timeNow
  }, { transaction, returning: ['*'] })
}

function insertDataGeneralService (sequence, service, timeNow, createdBy, transaction) {
  return Service.create({
    serviceCode: sequence,
    serviceName: service.serviceName,
    serviceTypeId: service.serviceTypeId,
    createdBy: createdBy,
    updatedBy: '---',
    createdAt: timeNow
  }, { transaction, returning: ['*'] })
}

export async function createService (servicecode, service, createdBy, next) {
  let transaction
  try {
    const setting = await getSettingByCode('Sequence')

    let settingValue = false
    if (setting) {
      const parseJSONSettingValue = JSON.parse(setting.settingValue)
      settingValue = parseJSONSettingValue.autoService
    }

    transaction = await sequelize.transaction()
    let sequence

    if (settingValue) {
      sequence = await getSequenceFormatByCode({ seqCode: 'SVC', type: 1 })
      const lastSequence = await getDataByStoreAndCode('SVC', 1)
      await increaseSequence('SVC', 1, lastSequence.seqValue, transaction)
    } else {
      sequence = servicecode
    }
    
    const timeNow = moment()
    // insert general information of services item
    const resultGeneralServices = await insertDataGeneralService(sequence, service, timeNow, createdBy, transaction)
    const createdGeneralServices = JSON.parse(JSON.stringify(resultGeneralServices))

    // insert general information of services item
    const resultUtilityServices = await insertDataUtilityService({ ...service, id: createdGeneralServices.id }, timeNow, createdBy, transaction)
    const createdUtilityServices = JSON.parse(JSON.stringify(resultUtilityServices))
    await transaction.commit()
    return {
      ...createdUtilityServices,
      ...createdGeneralServices,
      serviceCost: createdUtilityServices.service_cost
    }
  } catch (error) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = error
    return next(new ApiError(422, error + `Couldn't insert data.`, error))
  }
}

export async function updateService (serviceID, regID, service, updatedBy, next, newUtility = false) {
  const transaction = await sequelize.transaction()
  try {
    const timeNow = moment()

    await Service.update({
      serviceName: service.serviceName,
      serviceTypeId: service.serviceTypeId,
      updatedBy: updatedBy,
      updatedAt: timeNow
    }, { where: { id: serviceID } }, { transaction })

    if (newUtility) {
      await insertDataUtilityService({
        ...service,
        id: serviceID,
        reg_id: regID
      }, timeNow, updatedBy, transaction)
    } else {
      await utilityService.update({
        cost: parseFloat(service.cost),
        service_cost: parseFloat(service.serviceCost),
        active: !!service.active,
        reminder_in_day: service.reminder_in_day,
        reminder_in_km: service.reminder_in_km,
        sync_by: updatedBy,
        sync_at: timeNow
      }, { where: { service_id: serviceID, reg_id: regID } }, { transaction })
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = error
    return next(new ApiError(422, error + `Couldn't insert data.`, error))
  }
}

export function deleteService (serviceData) {
  return Service.destroy({
    where: {
      serviceCode: serviceData
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteServices (services) {
  if (!isEmpty(services)) {
    return Service.destroy({
      where: services
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
