/**
 * Created by panda .has .my .id on 4/17/27.
 */
import project from '../../../config/project.config'
import { ApiError} from '../../services/v1/errorHandlingService'
import { setMemberTypeInfo, getMemberTypeByCode, memberTypeExists,
  getMemberTypesData, createMemberType, updateMemberType, deleteMemberType, deleteMemberTypes }
  from '../../services/member/memberTypeService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve list a Member Type
exports.getType = function (req, res, next) {
  console.log('Requesting-getType: ' + req.url + ' ...')
  const typecode = req.params.id
  getMemberTypeByCode(typecode).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Member Type ${typecode}.`, err)))
}

// Retrieve list of Member Type
exports.getTypes = function (req, res, next) {
  console.log('Requesting-getTypes: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getMemberTypesData(other).then((types) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(types)),
      total: types.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Member Types.`, err)))
}

// Create a new Member Type
exports.insertType = function (req, res, next) {
  console.log('Requesting-insertType: ' + req.url + ' ...')
  const typecode = req.params.id
  const type = req.body
  const userLogIn=extractTokenProfile(req)
  memberTypeExists(typecode).then(exists => {
    if (exists) {
      next(new ApiError(409, `Member Type ${typecode} already exists.`))
    } else {
      createMemberType(typecode, type, userLogIn.userid, next).then((typeCreated) => {
        return getMemberTypeByCode(typeCreated.typeCode).then((typeByCode) => {
          const typeInfo = setMemberTypeInfo(typeByCode)
          let jsonObj = {
            success: true,
            message: `Member Type ${typeInfo.typeCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { type: typeInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find Member Type ${typecode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Member Type ${typecode}.`, err)))
    }
  })
}

//Update a Member Type
exports.updateType = function (req, res, next) {
  console.log('Requesting-updateType: ' + req.url + ' ...')
  const typecode = req.params.id
  let type = req.body
  const userLogIn=extractTokenProfile(req)
  memberTypeExists(typecode).then(exists => {
    if (exists) {
      return updateMemberType(typecode, type, userLogIn.userid, next).then((typeUpdated) => {
        return getMemberTypeByCode(typecode).then((typeByCode) => {
          const typeInfo = setMemberTypeInfo(typeByCode)
          let jsonObj = {
            success: true,
            message: `Member Type ${typeByCode.typeCode} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { type: typeInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Member Type ${typecode}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update Member Type ${typecode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Member Type ${typecode}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Member Type ${typecode}.`, err)))
}

//Delete a Member
exports.deleteType = function (req, res, next) {
  console.log('Requesting-deleteType: ' + req.url + ' ...')
  const typecode = req.params.id
  memberTypeExists(typecode).then(exists => {
    if (exists) {
      return deleteMemberType(typecode).then((typeDeleted) => {
        if (typeDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Member Type ${typecode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { type: typeDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next( new ApiError(422, `Couldn't delete Member ${typecode}.`) )
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Member Type ${typecode}}.`, err)))
    } else {
      next( new ApiError(422, `Member Type${typecode} not exists.`) )
    }
  }).catch(err => next(new ApiError(422, `Member Type${typecode} not exists.`, err)))
}

//Delete some Member Type
exports.deleteTypes = function (req, res, next) {
  console.log('Requesting-deleteTypes: ' + req.url + ' ...')
  let types = req.body;
  deleteMemberTypes(types, next).then((typesDeleted) => {
    if (typesDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Types [ ${types.typeCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { types: typesDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next( new ApiError(422, `Couldn't delete Types [ ${types.typeCode} ].`) )
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Types [ ${types.typeCode} ].`, err)))
}
