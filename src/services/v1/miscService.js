import { Op } from 'sequelize'
import db from '../../models'
import dbv from '../../models/view'
import { ApiError} from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
// import mapFields from '../../utils/mapping/mapFields'

let Misc = db.tbl_misc
let vwMisc = dbv.vw_misc

const miscAttributes = [ 'id', 'miscCode', 'miscName', 'miscDesc', 'miscVariable', 'createdBy', 'createdAt',
'updatedBy', 'updatedAt', ]



export function getMiscByCode (miscCode, query) {
  if (query) {
    if (query.hasOwnProperty('fields')) {
      if (query.hasOwnProperty('for')) {
        return Misc.findAll({
          where: {miscCode: miscCode},
          attributes: query.fields.split(','),
          raw: false
        }).then(findResult => {
          return setMiscLov(JSON.parse(JSON.stringify(findResult)))
        })
      } else if (query.hasOwnProperty('as')) {
        return Misc.findAll({
          where: {miscCode: miscCode},
          attributes: query.fields.split(','),
          raw: false
        }).then(findResult => {
          return setMiscAs(JSON.parse(JSON.stringify(findResult)), query.as)
        })
      } else {
        return Misc.findAll({
          where: { miscCode: miscCode },
          attributes: query.fields.split(','),
          raw: false
        }).then(findResult => {
          return JSON.parse(JSON.stringify(findResult))
        })
      }
    } else {
      return Misc.findAll({
        where: { miscCode: miscCode },
        raw: false,
        attributes: miscAttributes
      }).then(result => {
        return JSON.parse(JSON.stringify(result))
      })
    }
  }
  else {
    return Misc.findAll({
      where: { miscCode: miscCode },
      raw: false,
      attributes: miscAttributes
    }).then(result => {
      return JSON.parse(JSON.stringify(result))
    })
  }
}

export function getEveryMiscByCode (miscCode) {
  return Misc.findAll({
    where: { miscCode },
    attributes: ['miscName', 'miscDesc'],
    raw: false
  })
}

export function getAllMiscByCodeNames (miscCode, miscNames = []) {
  return Misc.findAll({
    where: { misccode: miscCode, miscname: { [Op.in]: miscNames } },
    attributes: ['miscname', 'miscdesc'],
    raw: true
  })
}

export function getMiscByCodeName (miscCode, miscName) {
  return Misc.findOne({
    where: {
      miscCode: miscCode,
      miscName: miscName
    },
    raw: false
  })
}

export function getMiscsData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key]={[Op.between]: query[key]}
    }
  }
  if (query) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'miscCode')
      query = JSON.parse(str)
    }
    return vwMisc.findAll({
      attributes: ['miscCode', 'miscName', 'miscDesc', 'miscVariable',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      where: query,
      order: [['id', 'DESC']]
    })
  } else {
    return vwMisc.findAll({
      attributes: ['miscCode', 'miscName', 'miscDesc', 'miscVariable',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      order: [['id', 'DESC']]
    })
  }
}

export function setMiscInfo (request) {
  const getMiscInfo = {
    miscCode: request.miscCode,
    miscName: request.miscName,
    miscDesc: request.miscDesc,
    miscVariable: request.miscVariable
  }
  return getMiscInfo
}

export function setMiscLov (request) {
  const m = { miscName: 'key', miscDesc: 'title' }
  const getMiscLov = o => Object.assign(...Object.keys(o).map(k => ({ [m[k] || k]: o[k] })))
  return request.map(getMiscLov)
}

export function setMiscAs (request, asKey) {
  const asChange = asKey.split(',')
  const m = { miscName: asChange[0], miscDesc: asChange[1] }
  const getMiscLov = o => Object.assign(...Object.keys(o).map(k => ({ [m[k] || k]: o[k] })))
  return request.map(getMiscLov)
}

export function miscCodeExists (miscCode) {
  return getMiscByCode(miscCode).then(misc => {
    if ( misc == null ) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function miscCodeNameExists (miscCode, miscName) {
  return getMiscByCodeName(miscCode, miscName).then(misc => {
    if ( misc == null ) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createMisc (misccode, miscname, misc, createdBy, next) {
  return Misc.create({
    miscCode: misccode,
    miscName: miscname,
    miscDesc: misc.miscDesc,
    miscVariable: misc.miscVariable,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateMisc (misccode, miscname, misc, updateBy, next) {
  return Misc.update({
      miscDesc: misc.miscDesc,
      miscVariable: misc.miscVariable,
      updatedBy: updateBy
    },
    { where: { miscCode: misccode, miscName: miscname } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteMisc (misccode, miscname) {
  return Misc.destroy({
    where: {
      miscCode: misccode,
      miscName: miscname,
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteMiscs (miscs) {
  if (!isEmpty(miscs)) {
    return Misc.destroy({
      where: miscs
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
