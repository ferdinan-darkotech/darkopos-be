import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, insertData, updateData, deleteData,
  cancelData, dataExistsCode, getDataCode
} from '../../services/master/bundlingService'
import { srvFindAllStoreByParent, srvGetStoreBranch } from '../../services/v2/master/store/srvStore'

import { srvGetSomeProductPriceByCode } from '../../services/stockService'
import { getSomeServiceByCodeReg } from '../../services/service/serviceService'

// Retrieve list a row
exports.getDataId = function (req, res, next) {
  console.log('Requesting-getDataId: ' + req.url + ' ...')
  const id = req.params.id
  getDataId(id).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(422, `Couldn't find data ${id}.`, err)))
}

// Retrieve list of stocks
exports.getData = function (req, res, next) {
  console.log('Requesting-getStocksBundling01: ' + req.url + ' ...')
  let { pageSize, q, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  let tmpId = other.id
  countData({...other, tmpId}).then((count) => {
    return getData({ ...other, tmpId }, pagination).then((data) => {
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

// Create a new data
exports.insertData = function (req, res, next) {
  console.log('Requesting-insertData-Bundlings: ' + req.url + ' ...')
  const body = req.body
  const userLogIn = req.$userAuth
  const availStores = Array.isArray(body.data['availableStore']) ? body.data['availableStore'] : []
  const listRewards = Array.isArray(body['listReward']) ? body['listReward'] : []
  const listRules = Array.isArray(body['listRules']) ? body['listRules'] : []
  const joinDetails = listRewards.concat(listRules)
  dataExistsCode(body.data.code).then(async exists => {
    const storeBranch = await srvGetStoreBranch((userLogIn.store || '??').toString())

    if(!storeBranch) throw new Error('Group store is not found, please contact IT Support.')

    // START: mapping available store groups
    const storeListGroups = await srvFindAllStoreByParent(storeBranch.parent_store_id, 'id')
    let filteredAvailStores = []

    if(availStores.length > 0) filteredAvailStores = availStores.filter(a => storeListGroups.indexOf(+a) !== -1)
    else filteredAvailStores = storeListGroups

    if(filteredAvailStores.length === 0) throw new Error('No store available.')
    // END: mapping available store groups

    const tmpDetails = joinDetails.reduce((a, b) => (a[b.type] || []).indexOf(b.productCode) === -1 ? {
      ...a,
      [b.type]: [...a[b.type], b.productCode]
    } : a, { S: [], P: [] })

    
    const listItemProducts = await srvGetSomeProductPriceByCode(tmpDetails.P)
    const listItemServices = JSON.parse(JSON.stringify(await getSomeServiceByCodeReg(tmpDetails.S, storeBranch.parent_store_id) || []))

    const concatCheckItems = {
      ...listItemProducts.reduce((a, b) => ({ ...a, [`P:${b.productcode}`]: { id: b.productid, price: b.sellprice } }), {}),
      ...listItemServices.reduce((a, b) => ({ ...a, [`S:${b.serviceCode}`]: { id: b.id, price: b.serviceCost } }), {})
    }

    let restrictItems = null
    // mapping new rewards
    for(let x in listRewards) {
      const items = listRewards[x]
      const checkItems = concatCheckItems[`${items.type}:${items.productCode}`]
      if(!checkItems) {
        restrictItems = { product: items.productCode, message: 'Not Found' }
        break
      }
      listRewards[x].productId = checkItems.id
      listRewards[x].sellingPrice = checkItems.price
    }

    if(!restrictItems) {
      for(let x in listRules) {
        const items = listRules[x]
        const checkItems = concatCheckItems[`${items.type}:${items.productCode}`]
        if(!checkItems) {
          restrictItems = { product: items.productCode, message: 'Not Found' }
          break
        }
        listRules[x].productId = checkItems.id
        listRules[x].sellingPrice = checkItems.price
      }
    }

    body.data['availableStore'] = filteredAvailStores.join(',')
    body.data['regID'] = storeBranch.parent_store_id
    body.listRules = listRules
    body.listReward = listRewards

    if (!exists) {
      return insertData(body.data, body.listRules, body.listReward, userLogIn.userid, next).then((created) => {
        let jsonObj = {
          success: true,
          message: `Data created`,
        }
        if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: created }) }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(501, `Couldn't create bundlings.`, err)))
    } else {
      return next(new ApiError(422, `Record ${body.data.code} - ${body.data.name} already exists.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateDataBundling: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  const userLogIn = req.$userAuth
  const availStores = Array.isArray(data['availableStore']) ? data['availableStore'] : []
  getDataCode(id, true).then(async _exists => {
    const exists = JSON.parse(JSON.stringify(_exists))
    const storeBranch = (await srvGetStoreBranch((userLogIn.store || '??').toString()) || {})
    
    if (!exists) {
      return next(new ApiError(422, `Couldn't find Data ${id}.`))
    } else if (exists.reg_id !== storeBranch.parent_store_id) {
      return next(new ApiError(422, `Regional doesn't match.`))
    } else {
      // START: mapping available store groups
      const storeListGroups = await srvFindAllStoreByParent(storeBranch.parent_store_id, 'id')
      let filteredAvailStores = []

      if(availStores.length > 0) filteredAvailStores = availStores.filter(a => storeListGroups.indexOf(+a) !== -1)
      else filteredAvailStores = storeListGroups

      if(filteredAvailStores.length === 0) throw new Error('No store available.')
      // END: mapping available store groups

      data['availableStore'] = filteredAvailStores.join(',')
      console.log('>>>', data)
      return res.xstatus(400).json({ success: false })
      return updateData(exists.id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: `Data updated`,
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

exports.cancelData = function (req, res, next) {
  console.log('Requesting-cancelDataBundling02: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body
  const userLogIn = req.$userAuth
  return getDataCode(id, true).then(async _exists => {
    const exists = JSON.parse(JSON.stringify(_exists))
    const storeBranch = (await srvGetStoreBranch((userLogIn.store || '??').toString()) || {})
    if (!exists) {
      return next(new ApiError(422, `Couldn't find Data ${id}.`))
    } else if (exists.reg_id !== storeBranch.parent_store_id) {
      return next(new ApiError(422, `Regional doesn't match.`))
    } else {
      return cancelData(exists.id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: 'Data success void',
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

// Delete a Record
exports.deleteData = function (req, res, next) {
  console.log('Requesting-deleteData: ' + req.url + ' ...')
  const id = req.params.id
  const userLogIn = req.$userAuth
  return getDataCode(id, true).then(async _exists => {
    const exists = JSON.parse(JSON.stringify(_exists))
    const storeBranch = (await srvGetStoreBranch((userLogIn.store || '??').toString()) || {})
    if (!exists) {
      return next(new ApiError(422, `Couldn't find Data ${id}.`))
    } else if (exists.reg_id !== storeBranch.parent_store_id) {
      return next(new ApiError(422, `Regional doesn't match.`))
    } else {
      return deleteData(exists.id, next).then((stockDeleted) => {
        if (stockDeleted) {
          let jsonObj = {
            success: true,
            message: `Data ${id} deleted`,
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Data ${id}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Data ${id}.`, err)))
    }
  }).catch(err => next(new ApiError(404, `Data ${id} not exists.`, err)))
}
