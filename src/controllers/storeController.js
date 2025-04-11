import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import {
  getStoreQuery, getStore, getData, countData, srvUpdateStore, srvStoreIdExists, srvStoreCodeExists,
  srvCreateStore, srvGetStoreByCode, srvGetStoreById, srvSetStoreInfo, srvDeleteStore
} from '../services/setting/storeService'
import { getPeriodActive } from '../services/periodeService'
import { reGenerateToken } from '../services/v1/securityService'
import { checkJSONNested } from '../utils/operate/objOpr';

exports.getStore = function (req, res, next) {
  console.log('Requesting-getStore: ' + req.url + ' ...')
  const query = { storeCode: req.params.id }
  return getStoreQuery(query, 'store').then((store) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: store
    })
  }).catch(err => next(new ApiError(422, 'Something wrong', err)))
}

exports.getSettingStore = function (req, res, next) {
  console.log('Requesting-getSettingStore: ' + req.url + ' ...')
  return getStoreQuery({ store: req.params.id }, 'settingstore').then((store) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(store[0]))
    })
  }).catch(err => next(new ApiError(422, 'Something wrong', err)))
}


function remakeTokenWhenStoreChanges (req, regenerate = false, replaceWith = {}) {
  return new Promise((resolve, reject) => {
    if(regenerate) {
      resolve(reGenerateToken(req, replaceWith))
    } else {
      resolve(null)
    }
  })
}

exports.getStoreById = async function (req, res, next) {
  console.log('Requesting-getStoreById: ' + req.url + ' ...')
  const renewToken = req.query.renewToken === 'Y'
  const storeId = { id: req.params.id }
  try {
    let prmsStore, prmsPeriod, prmsAll, settStore
    prmsStore = getStoreQuery(storeId, 'storebyid')
    settStore = getStoreQuery({ store: req.params.id }, 'settingstore')
    prmsPeriod = getPeriodActive(storeId.id)
    prmsAll = Promise.all([prmsStore, settStore, prmsPeriod])
    prmsAll.then(async (values) => {
      // values[0].settingValue = JSON.parse(values[0].settingValue)

      const storeValue = JSON.parse(JSON.stringify(values[0]))
      const settingVal = JSON.parse(JSON.stringify(values[1]))

      if (checkJSONNested(settingVal[0],'setting')) {
        storeValue[0].settingValue = JSON.parse(JSON.stringify(settingVal[0].setting))
      }
      if (checkJSONNested(settingVal[0],'settingparent')) {
        storeValue[0].settingParentValue = JSON.parse(JSON.stringify(settingVal[0].settingparent))
      }

      
      const newToken = await remakeTokenWhenStoreChanges(req, renewToken, { store: +storeValue[0].id, storeCode: storeValue[0].storeCode })

      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        data: storeValue,
        ...(renewToken ? { id_token: newToken } : {}),
        period: values[2]
      })
    })
  } catch (err) {
    next(new ApiError(422, 'Something wrong', err))
  }
//   const query = { id: req.params.id }
//   getStoreQuery(query, 'storebyid').then((store) => {
//     store[0].settingValue = JSON.parse(store[0].settingValue)
//     res.xstatus(200).json({
//       success: true,
//       message: 'Ok',
//       data: store
//     })
//   }).catch(err => next(new ApiError(422, 'Something wrong', err)))
}

// Retrieve list of data
exports.getListData = function (req, res, next) {
  console.log('Requesting-getStoreListData: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  countData(other).then((count) => {
    return getData(other, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: data
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

exports.getAllStores = function (req, res, next) {
  console.log('Requesting-getAllStores: ' + req.url + ' ...')
  let mode = 'allstores'
  if (req.query) {
    if (req.query.hasOwnProperty('mode')) {
      mode = mode + '-' + req.query.mode
    }
  }
  getStoreQuery(req.query, mode).then((store) => {
    let data = []
    if (!isEmpty(req.query)) {
      if (req.query.hasOwnProperty('mode')) {
        data = store
      }
    } else {
      if(mode === 'allstores') {
        data = store
      } else {
        data = JSON.parse(store[0].store)
      }
    }

    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'STR1-04',
      data: data
    })
  }).catch(err => next(new ApiError(422, 'Something wrong', err)))
}

exports.updateDefaultStore = function (req, res, next) {
  console.log('Requesting-updateDefaultStore: ' + req.url + ' ...')
  getStoreQuery('', 'allstores').then((store) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(store[0].store)
    })
  }).catch(err => next(new ApiError(422, 'Something wrong', err)))
}

// Create a new store
exports.insertStore = function (req, res, next) {
  console.log('Requesting-insertStore: ' + req.url + ' ...')
  const store = req.body
  const userLogIn = req.$userAuth
  srvStoreCodeExists(store.code).then(exists => {
    if (exists) {
      next(new ApiError(409, `ZSCC-00001: Store ${store.code} already available.`))
    } else {
      srvCreateStore(store, userLogIn.userid, next).then((created) => {
        srvGetStoreByCode(created.storeCode).then((results) => {
          const storeInfo = srvSetStoreInfo(results)
          let jsonObj = {
            success: true,
            message: `Store ${storeInfo.name} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { stores: storeInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(404, `ZSCC-00002: Couldn't find Store ${store.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZSCC-00003: Couldn't create Store ${store.code}.`, err)))
    }
  })
}

//Update a Store
exports.updateStore = function (req, res, next) {
  console.log('Requesting-updateStore: ' + req.url + ' ...')
  const storeId = req.params.id
  let store = req.body
  const userLogIn = req.$userAuth
  srvStoreIdExists(storeId).then(exists => {
    if (exists) {
      return srvUpdateStore(storeId, store, userLogIn.userid, next).then((updated) => {
        
        return srvGetStoreById(storeId).then((results) => {
          const storeInfo = srvSetStoreInfo(results)
          let jsonObj = {
            success: true,
            message: `Store ${storeInfo.name} updated`,
          }
          
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { stores: storeInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZSCC-00006: Couldn't update Store ${store.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZSCC-00007: Couldn't update Store ${store.code}.`, err)))
    } else {
      next(new ApiError(404, `ZSCC-00008: Couldn't find Store ${store.code}.`))
    }
  }).catch(err => next(new ApiError(422, `ZSCC-00009: Couldn't find Store ${store.code}.`, err)))
}

//Delete a Store
exports.deleteStore = function (req, res, next) {
  console.log('Requesting-deleteStore: ' + req.url + ' ...')
  const storeId = req.params.id
  srvStoreIdExists(storeId).then(exists => {
    if (exists) {
      return srvDeleteStore(storeId, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Store ${storeId} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { stores: deleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZSCC-00010: Couldn't delete Store ${storeId}.`))
        }
      }).catch(err => next(new ApiError(422, `ZSCC-00011: Couldn't delete Store ${storeId}}.`, err)))
    } else {
      next(new ApiError(422, `ZSCC-00012: Store ${storeId} not available.`))
    }
  }).catch(err => next(new ApiError(422, `ZSCC-00013: Store ${storeId} not available.`, err)))
}
