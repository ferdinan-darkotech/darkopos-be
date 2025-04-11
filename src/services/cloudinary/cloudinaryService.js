import cloudinary from 'cloudinary'
import moment from 'moment'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'
import { imageFilter } from '../../utils/check'
import db from '../../models'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'

let table = db.tbl_mobile_app_image

const Fields = ['id', 'title', 'body', 'imageUri', 'imageType', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']

export function uploadImage (req, res, next) {
  // --------------------------
  // Multer
  // --------------------------
  const UPLOAD_PATH = path.join(__dirname, 'uploads')
  const storage = multer.diskStorage({
    destination: `${UPLOAD_PATH}/`,
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)

        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  })
  const upload = multer({ dest: `${UPLOAD_PATH}/`, storage, fileFilter: imageFilter }).single('files')

  // --------------------------
  // Logic
  // --------------------------
  upload(req, res, function (err) {

    if (!req.file) return res.xstatus(500).json({
      success: false,
      message: 'Failed to read file, please check format',
      data: err
    })
    return cloudinary.v2.uploader.upload(
      req.file.path,
      {
        folder: `POS/${moment().format('MMMYYYY')}`
      },
      async (error, result) => {
        await fs.unlink(req.file.path, (err) => { if (err) console.log('error', err) })
        if (error) {
          res.xstatus(500).json({
            success: false,
            message: 'Failed to upload to server',
            data: error
          })
        }
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: result
        })
      }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
  })
}

export function getDataId (id) {
  return table.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function countData (query) {
  const { type, field, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { $iRegexp: query[key] }
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
        $or: querying
      },
    })
  } else {
    return table.count({
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
    return table.findAll({
      attributes: Fields,
      where: {
        $or: querying
      },
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
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}