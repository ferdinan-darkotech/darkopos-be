/**
 * Created by panda .has .my .id on 4/17/27.
 */
import project from '../../config/project.config'
import { ApiError} from '../services/v1/errorHandlingService'
import { setMiscInfo, getMiscByCode, getMiscByCodeName, miscCodeExists, miscCodeNameExists,
  getMiscsData, createMisc, updateMisc, deleteMisc, deleteMiscs }
  from '../services/v1/miscService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list some misc by code, name
exports.getMiscCodeName = function (req, res, next) {
  console.log('Requesting-getMiscCodeName: ' + req.url + ' ...')
  // const misccode = req.params.id
  const misccode = req.params.code
  const miscname = req.params.name
  getMiscByCodeName(misccode, miscname).then((misc) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: misc
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Misc ${misccode} - ${miscname}.`, err)))
}

// Retrieve list some misc by code
exports.getMiscCode = function (req, res, next) {
  console.log('Requesting-getMiscCode: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  const misccode = (req.params.code || 'no-params').toUpperCase()
  getMiscByCode(misccode, other).then((misc) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: misc // ((misc[0] || {}).dataValues || [])
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Misc ${misccode}.`, err)))
}

// Retrieve list of miscs
exports.getMiscs = function (req, res, next) {
  console.log('Requesting-getMiscs: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getMiscsData(other).then((miscs) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(miscs)),
      total: miscs.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Miscs.`, err)))
}

// Create a new misc
exports.insertMisc = function (req, res, next) {
  console.log('Requesting-insertMisc: ' + req.url + ' ...')
  console.log('req.params',req.params)
  const misccode = req.params.code
  const miscname = req.params.name
  const misc = req.body
  const userLogIn=extractTokenProfile(req)
  miscCodeNameExists(misccode, miscname).then(exists => {
    if (exists) {
      next(new ApiError(409, `Misc ${misccode} - ${miscname} already exists.`))
    } else {
      createMisc(misccode, miscname, misc, userLogIn.userid, next).then((miscCreated) => {
        getMiscByCodeName(miscCreated.miscCode, miscCreated.miscName).then((miscGetByCodeName) => {
          const miscInfo = setMiscInfo(miscGetByCodeName)
          let jsonObj = {
            success: true,
            message: `Misc ${miscInfo.miscCode} - ${miscInfo.miscName} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { misc: miscInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find misc ${misccode} - ${miscname}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create misc ${misccode} - ${miscname}.`, err)))
    }
  })
}

//Update a Misc
exports.updateMisc = function (req, res, next) {
  console.log('Requesting-updateMisc: ' + req.url + ' ...')
  const misccode = req.params.code
  const miscname = req.params.name
  let misc = req.body
  const userLogIn=extractTokenProfile(req)
  miscCodeNameExists(misccode, miscname).then(exists => {
    if (exists) {
      return updateMisc(misccode, miscname, misc, userLogIn.userid, next).then((miscUpdated) => {
        return getMiscByCodeName(misccode, miscname).then((miscGetByCodeName) => {
          const miscInfo = setMiscInfo(miscGetByCodeName)
          let jsonObj = {
            success: true,
            message: `Misc ${miscGetByCodeName.miscCode} - ${miscGetByCodeName.miscName}  updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { misc: miscInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Misc ${misccode} - ${miscname}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update misc ${misccode} - ${miscname}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Misc ${misccode} - ${miscname}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Misc ${misccode} - ${miscname}.`, err)))
}

//Delete a Misc
exports.deleteMisc = function (req, res, next) {
  console.log('Requesting-deleteMisc: ' + req.url + ' ...')
  const misccode = req.params.code
  const miscname = req.params.name
  miscCodeNameExists(misccode, miscname).then(exists => {
    if (exists) {
      return deleteMisc(misccode, miscname).then((miscDeleted) => {
        if (miscDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Misc ${misccode} - ${miscname} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { miscs: miscDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next( new ApiError(422, `Couldn't delete Misc ${misccode} - ${miscname}.`) )
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Misc ${misccode} - ${miscname}.`, err)))
    } else {
      next( new ApiError(422, `Misc ${misccode} - ${miscname} not exists.`) )
    }
  }).catch(err => next(new ApiError(422, `Misc ${misccode} - ${miscname} not exists.`, err)))
}

//Delete some Misc
exports.deleteMiscs = function (req, res, next) {
  console.log('Requesting-deleteMiscs: ' + req.url + ' ...')
  let miscs = req.body;
  deleteMiscs(miscs).then((miscDeleted) => {
    if (miscDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Miscs [ ${miscs.miscCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { miscs: miscDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next( new ApiError(422, `Couldn't delete Miscs [ ${miscs.miscCode} ].`) )
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Miscs [ ${miscs.miscCode} ].`, err)))
}
