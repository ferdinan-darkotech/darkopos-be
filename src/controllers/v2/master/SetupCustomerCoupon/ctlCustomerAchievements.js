import {
  srvGetAllCustAchievementsProdByAchieveId, srvGetAllCustAchievementsServByAchieveId,
  srvGetOneCustAchievementsById, srvGetSomeCustAchievements, srvGetOneCustAchievementsByType,
  srvCreateCustomerAchievements, srvUpdateCustomerAchievements
} from '../../../../services/v2/master/SetupCustomerCoupon/srvCustomerAchievements'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getMemberTypeByCode } from '../../../../services/member/memberTypeService'
import { srvGetStoreBranch } from '../../../../services/v2/master/store/srvStore'
import { srvGetSomeProductByCode } from '../../../../services/stockService'
import { getSomeServiceByCodeReg } from '../../../../services/service/serviceService'


export function ctlGetSomeCustAchievements (req, res, next) {
  console.log('Requesting-ctlGetSomeCustAchievements: ' + JSON.stringify(req.url) + ' ...')
  const { store } = req.$userAuth
  const { ...otherQuery } = req.query
  return srvGetStoreBranch(store).then(stores => {
    return srvGetSomeCustAchievements({ ...otherQuery, ho_id: stores.parent_store_id }).then(achieve => {
      res.xstatus(200).json({
        success: true,
        data: achieve.rows,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 10,
        total: achieve.count
      })
    }).catch(err => next(new ApiError(422, `CTCACV-00001.0: Couldn't find customer achievements.`, err)))
  }).catch(err => next(new ApiError(422, `CTCACV-00001.1: Couldn't find customer achievements.`, err)))
}

export function ctlGetOneCustAchievementsById (req, res, next) {
  console.log('Requesting-ctlGetOneCustAchievementsById: ' + JSON.stringify(req.url) + ' ...')
  return srvGetOneCustAchievementsById(req.params.achieve_id).then(achieve => {
    res.xstatus(200).json({
      success: true,
      data: (achieve || {})
    })
  }).catch(err => next(new ApiError(422, `CTCACV-00002: Couldn't find customer achievements.`, err)))
}

export function ctlGetAllCustAchievementsProdByAchieveId (req, res, next) {
  console.log('Requesting-ctlGetAllCustAchievementsProdByAchieveId: ' + JSON.stringify(req.url) + ' ...')
  return srvGetAllCustAchievementsProdByAchieveId(req.params.achieve_id).then(achieve => {
    res.xstatus(200).json({
      success: true,
      data: achieve,
      total: achieve.length
    })
  }).catch(err => next(new ApiError(422, `CTCACV-00003: Couldn't find customer achievements.`, err)))
}

export function ctlGetAllCustAchievementsServByAchieveId (req, res, next) {
  console.log('Requesting-ctlGetAllCustAchievementsServByAchieveId: ' + JSON.stringify(req.url) + ' ...')
  return srvGetAllCustAchievementsServByAchieveId(req.params.achieve_id).then(achieve => {
    res.xstatus(200).json({
      success: true,
      data: achieve,
      total: achieve.length
    })
  }).catch(err => next(new ApiError(422, `CTCACV-00004: Couldn't find customer achievements.`, err)))
}

export function ctlCreateCustomerAchievements (req, res, next) {
  console.log('Requesting-ctlCreateCustomerAchievements: ' + JSON.stringify(req.url) + ' ...')
  const userInfo = req.$userAuth
  const {
    detail_service, detail_product, ...otherData
  } = req.body

  return srvGetStoreBranch(userInfo.store).then(tmpStore => {
    if(!(tmpStore || {}).parent_store_id) throw new Error('Parent store is not found.')

    return getMemberTypeByCode(otherData.member_type).then(async memType => {
      let tmpType = JSON.parse(JSON.stringify(memType))
      if(!(tmpType || {}).id) throw new Error('Type member is not found.')

      const listProductCode = detail_product.map(x => x.product_code)
      const listServiceCode = detail_service.map(x => x.service_code)
  
      const findProduct = await srvGetSomeProductByCode(listProductCode)
      const findService = await getSomeServiceByCodeReg(listServiceCode, tmpStore.parent_store_id)
      
      const newProduct = detail_product.map(x => {
        const currProd = (findProduct.filter(y => (x.product_code === y.productcode))[0] || {})
        return { product_id: currProd.productid, ...x }
      })
      const newService = detail_service.map(x => {
        const currProd = (findService.filter(y => (x.service_code === y.serviceCode))[0] || {})
        return { service_id: currProd.id, ...x }
      })
  
      const newPayload = {
        ...req.body,
        ho_id: tmpStore.parent_store_id,
        member_type_id: tmpType.id,
        detail_product: newProduct,
        detail_service: newService
      }
      return srvCreateCustomerAchievements(newPayload, userInfo).then(achieve => {
        if(achieve.success) {
          res.xstatus(200).json({
            success: true,
            message: achieve.message
          })
        } else {
          throw new Error(achieve.message)
        }
      }).catch(err => next(new ApiError(422, `CTCACV-00007: Couldn't create customer achievements.`, err)))
    }).catch(err => next(new ApiError(422, `CTCACV-00006: Couldn't create customer achievements.`, err)))
  }).catch(err => next(new ApiError(422, `CTCACV-00005: Couldn't create customer achievements.`, err)))
}


export function ctlUpdateCustomerAchievements (req, res, next) {
  console.log('Requesting-ctlUpdateCustomerAchievements: ' + JSON.stringify(req.url) + ' ...')
  const userInfo = req.$userAuth
  const {
    detail_service, detail_product, ...otherData
  } = req.body


  return srvGetStoreBranch(userInfo.store).then(tmpStore => {
    if(!(tmpStore || {}).parent_store_id) throw new Error('Parent store is not found.')

    return getMemberTypeByCode(otherData.member_type).then(async memType => {
      let tmpType = JSON.parse(JSON.stringify(memType))
      if(!(tmpType || {}).id) throw new Error('Type member is not found.')
      return srvGetOneCustAchievementsById(req.params.achieve_id).then(async exists => {
        const existsItem = (exists || {})
        if(!existsItem.id) throw new Error('Data not found.')

        const listProductCode = detail_product.map(x => x.product_code)
        const listServiceCode = detail_service.map(x => x.service_code)

        const findProduct = await srvGetSomeProductByCode(listProductCode)
        const findService = await getSomeServiceByCodeReg(listServiceCode, tmpStore.parent_store_id)

        const newProduct = detail_product.map(x => {
          const currProd = (findProduct.filter(y => (x.product_code === y.productcode))[0] || {})
          return { product_id: currProd.productid, ...x }
        })
        const newService = detail_service.map(x => {
          const currProd = (findService.filter(y => (x.service_code === y.serviceCode))[0] || {})
          return { service_id: currProd.id, ...x }
        })

        const newPayload = {
          ...req.body,
          achieve_id: req.params.achieve_id,
          ho_id: tmpStore.parent_store_id,
          member_type_id: tmpType.id,
          detail_product: newProduct,
          detail_service: newService
        }

        return srvUpdateCustomerAchievements(newPayload, userInfo).then(achieve => {
          if(achieve.success) {
            res.xstatus(200).json({
              success: true,
              message: achieve.message
            })
          } else {
            throw new Error(achieve.message)
          }
        }).catch(err => next(new ApiError(422, `CTCACV-00011: Couldn't update customer achievements.`, err)))
      }).catch(err => next(new ApiError(422, `CTCACV-00010: Couldn't update customer achievements.`, err)))
    }).catch(err => next(new ApiError(422, `CTCACV-00009: Couldn't update customer achievements.`, err)))
  }).catch(err => next(new ApiError(422, `CTCACV-00008: Couldn't update customer achievements.`, err)))
}

export function ctlPackCustomerAchievements (req, res, next) {
  console.log('Requesting-ctlPackCustomerAchievements: ' + JSON.stringify(req.url) + ' ...')
  const userInfo = req.$userAuth
  return srvGetStoreBranch(userInfo.store).then(stores => {
    return srvGetOneCustAchievementsByType(stores.parent_store_id, req.params.member_type).then(async achieve => {
      const newAchieve = (achieve || {})
      if(!newAchieve.id) {
        res.xstatus(200).json({
          success: true,
          products: [],
          services: []
        })
      } else {
        const achievementProducts = await srvGetAllCustAchievementsProdByAchieveId(newAchieve.id, 'bf')
        const achievementServices = await srvGetAllCustAchievementsServByAchieveId(newAchieve.id, 'bf')
        res.xstatus(200).json({
          success: true,
          products: achievementProducts,
          services: achievementServices
        })
      }
    }).catch(err => next(new ApiError(422, `CTCACV-000013: Couldn't find customer achievements.`, err)))
  }).catch(err => next(new ApiError(422, `CTCACV-000012: Couldn't find customer achievements.`, err)))
}