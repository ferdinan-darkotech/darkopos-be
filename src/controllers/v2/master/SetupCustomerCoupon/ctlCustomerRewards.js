import {
  srvGetAllCustRewardsProdByRewardId, srvGetAllCustRewardsServByRewardId,
  srvGetOneCustRewardsById, srvGetSomeCustRewards, srvGetOneCustRewardsByType,
  srvCreateCustomerRewards, srvUpdateCustomerRewards
} from '../../../../services/v2/master/SetupCustomerCoupon/srvCustomerRewards'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../../services/v1/securityService'
import { getMemberTypeByCode } from '../../../../services/member/memberTypeService'
import { srvGetSomeProductByCode } from '../../../../services/stockService'
import { srvGetStoreBranch } from '../../../../services/v2/master/store/srvStore'
import { getSomeServiceByCodeReg } from '../../../../services/service/serviceService'

export function ctlGetSomeCustRewards (req, res, next) {
  console.log('Requesting-ctlGetSomeCustRewards: ' + JSON.stringify(req.url) + ' ...')
  const { store } = req.$userAuth
  return srvGetStoreBranch(store).then(stores => {
    return srvGetSomeCustRewards({ ...req.query, ho_id: stores.parent_store_id }).then(reward => {
      res.xstatus(200).json({
        success: true,
        data: reward.rows,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 10,
        total: reward.count
      })
    }).catch(err => next(new ApiError(422, `CTCRWD-00001.0: Couldn't find customer rewards.`, err)))
  }).catch(err => next(new ApiError(422, `CTCRWD-00001.1: Couldn't find customer rewards.`, err)))
}

export function ctlGetOneCustRewardsById (req, res, next) {
  console.log('Requesting-ctlGetOneCustRewardsById: ' + JSON.stringify(req.url) + ' ...')
  return srvGetOneCustRewardsById(req.params.reward_id).then(reward => {
    res.xstatus(200).json({
      success: true,
      data: (reward || {})
    })
  }).catch(err => next(new ApiError(422, `CTCRWD-00002: Couldn't find customer rewards.`, err)))
}

export function ctlGetAllCustRewardsProdByRewardId (req, res, next) {
  console.log('Requesting-ctlGetAllCustRewardsProdByRewardId: ' + JSON.stringify(req.url) + ' ...')
  return srvGetAllCustRewardsProdByRewardId(req.params.reward_id).then(reward => {
    res.xstatus(200).json({
      success: true,
      data: reward,
      total: reward.length
    })
  }).catch(err => next(new ApiError(422, `CTCRWD-00003: Couldn't find customer rewards.`, err)))
}

export function ctlGetAllCustRewardsServByRewardId (req, res, next) {
  console.log('Requesting-ctlGetAllCustRewardsServByRewardId: ' + JSON.stringify(req.url) + ' ...')
  return srvGetAllCustRewardsServByRewardId(req.params.reward_id).then(reward => {
    res.xstatus(200).json({
      success: true,
      data: reward,
      total: reward.length
    })
  }).catch(err => next(new ApiError(422, `CTCRWD-00004: Couldn't find customer rewards.`, err)))
}

export function ctlCreateCustomerRewards (req, res, next) {
  console.log('Requesting-ctlCreateCustomerRewards: ' + JSON.stringify(req.url) + ' ...')
  const userInfo = req.$userAuth
  const {
    detail_service, detail_product, ...otherData
  } = req.body

  return srvGetStoreBranch(otherData.store_code).then(tmpStore => {
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
      return srvCreateCustomerRewards(newPayload, userInfo).then(reward => {
        if(reward.success) {
          res.xstatus(200).json({
            success: true,
            message: reward.message
          })
        } else {
          throw new Error(reward.message)
        }
      }).catch(err => next(new ApiError(422, `CTCRWD-00007: Couldn't create customer rewards.`, err)))
    }).catch(err => next(new ApiError(422, `CTCRWD-00006: Couldn't create customer rewards.`, err)))
  }).catch(err => next(new ApiError(422, `CTCRWD-00005: Couldn't create customer rewards.`, err)))
}


export function ctlUpdateCustomerRewards (req, res, next) {
  console.log('Requesting-ctlUpdateCustomerRewards: ' + JSON.stringify(req.url) + ' ...')
  const userInfo = req.$userAuth
  const {
    detail_service, detail_product, ...otherData
  } = req.body


  return srvGetStoreBranch(otherData.store_code).then(tmpStore => {
    if(!(tmpStore || {}).parent_store_id) throw new Error('Parent store is not found.')

    return getMemberTypeByCode(otherData.member_type).then(async memType => {
      let tmpType = JSON.parse(JSON.stringify(memType))
      if(!(tmpType || {}).id) throw new Error('Type member is not found.')
      return srvGetOneCustRewardsById(req.params.reward_id).then(async exists => {
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
          reward_id: req.params.reward_id,
          ho_id: tmpStore.parent_store_id,
          member_type_id: tmpType.id,
          detail_product: newProduct,
          detail_service: newService
        }

        return srvUpdateCustomerRewards(newPayload, userInfo).then(reward => {
          if(reward.success) {
            res.xstatus(200).json({
              success: true,
              message: reward.message
            })
          } else {
            throw new Error(reward.message)
          }
        }).catch(err => next(new ApiError(422, `CTCRWD-00011: Couldn't update customer rewards.`, err)))
      }).catch(err => next(new ApiError(422, `CTCRWD-00010: Couldn't update customer rewards.`, err)))
    }).catch(err => next(new ApiError(422, `CTCRWD-00009: Couldn't update customer rewards.`, err)))
  }).catch(err => next(new ApiError(422, `CTCRWD-00008: Couldn't update customer rewards.`, err)))
}

export function ctlPackCustomerRewards (req, res, next) {
  console.log('Requesting-ctlPackCustomerRewards: ' + JSON.stringify(req.url) + ' ...')
  const { store } = req.$userAuth
  return srvGetStoreBranch(store).then(tmpStore => {
    return srvGetOneCustRewardsByType(tmpStore.parent_store_id, req.params.member_type).then(async reward => {
      const newReward = (reward || {})
      if(!newReward.id) {
        res.xstatus(200).json({
          success: true,
          products: [],
          services: []
        })
      } else {
        const rewardProducts = await srvGetAllCustRewardsProdByRewardId(newReward.id, 'bf')
        const rewardServices = await srvGetAllCustRewardsServByRewardId(newReward.id, 'bf')
        res.xstatus(200).json({
          success: true,
          products: rewardProducts,
          services: rewardServices
        })
      }
    }).catch(err => next(new ApiError(422, `CTCRWD-000013: Couldn't find customer rewards.`, err)))
  }).catch(err => next(new ApiError(422, `CTCRWD-000012: Couldn't find customer rewards.`, err)))
}