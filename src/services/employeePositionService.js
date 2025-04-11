import db from '../models/tableR'
import { ApiError} from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'

const JobPosition = db.tbl_job_position

const positionBrowseFields = ['positionCode', 'positionName' ]

const positionFields = ['positionCode', 'positionName',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt' ]

export function getPositionByCode (positionCode) {
  return JobPosition.findOne({
    where: {
      positionCode: positionCode
    },
    raw: false
  })
}

export function setMapLov (request) {
  console.log('setMapLov',request)
  const m = { id: 'value', positionName: 'label' }
  const getMiscLov = o => Object.assign(...Object.keys(o).map(k => ({ [m[k] || k]: o[k] })))
  console.log('setMapLov',request.map(getMiscLov))
  return request.map(getMiscLov)
}

export function getPositionsData (query) {
  console.log('getPositionsData', query)
  for (let key in query) {
    if (key === 'createdAt') {
      query[key]={between: query[key]}
    }
  }
  if (!isEmpty(query)) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'positionCode')
      query = JSON.parse(str)
    }
    if (query.hasOwnProperty('for')) {
      console.log('hasOwnProperty')
      return JobPosition.findAll({
        attributes: query.fields.split(','),
        raw: false
      }).then(findResult => {
        return setMapLov(findResult)
      })
    }
    console.log('positionFields',positionFields)
    return JobPosition.findAll({
      attributes: positionFields,
      where: query
    })
  } else {
    return JobPosition.findAll({
      attributes: positionBrowseFields
    })
  }
}

export function setPositionInfo (request) {
  const getPositionInfo = {
    positionCode: request.positionCode,
    positionName: request.positionName
  }

  return getPositionInfo
}

export function positionExists (positionCode) {
  return getPositionByCode(positionCode).then(position => {
    if ( position == null ) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createPosition (positioncode, position, createdBy, next) {
  return JobPosition.create({
    positionCode: positioncode,
    positionName: position.positionName,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updatePosition (positioncode, position, updateBy, next) {
  return JobPosition.update({
      positionName: position.positionName,
      updatedBy: updateBy
    },
    { where: { positionCode: positioncode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deletePosition (positioncode, next) {
  return JobPosition.destroy({
    where: {
      positionCode: positioncode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deletePositions (positions, next) {
  if (!isEmpty(positions)) {
    return JobPosition.destroy({
      where: positions
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
