import project from '../../../../config/project.config'
import { extractTokenProfile } from '../../../services/v1/securityService'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetStocksBrandByCode } from '../../../services/v2/master/stocks/srvStocksBrand'
import { srvGetStoresByCode } from '../../../services/v2/master/store/srvStore'
import { srvGetStocksCategoryByCode } from '../../../services/v2/master/stocks/srvStocksCategory'
import { getMiscByCode } from '../../../services/v1/miscService'
import {
  srvCreateTargetHeader, srvCreateTargetDetail, srvCheckExistTargetHeader, srvGetTargetHeader, srvGetTargetDetail,
  srvGetTargetDetailByReference, srvCreateTargetOther, srvModifyTarget
} from '../../../services/v2/marketing/srvSalesTarget'
import mappingObjectTargetDetail from '../../../utils/mappingObjectTargetDetail'
import sequelize from '../../../native/sequelize'
import moment from 'moment'

const ctlGetTargetHeader = function (req,res, next) {
  console.log('Requesting-ctlGetTargetHeader: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  return srvGetTargetHeader(req.query).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: rs.count
    })
  }).catch(er => next(new ApiError(400, er.message)))
}

const ctlGetTargetDetail = function (req,res, next) {
  console.log('Requesting-ctlGetTargetDetail: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  let mapping = req.query ? (req.query.map === 'type1') : false
  return srvGetTargetDetail(req).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: mapping ? mappingObjectTargetDetail(rs.rows) : rs.rows,
      total: rs.count
    })
  }).catch(er => next(new ApiError(400, er.message)))
}

exports.ctlGetTargetDetailByReference = function (req,res, next) {
  console.log('Requesting-ctlGetTargetDetailByReference: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  
  let mapping = req.query ? (req.query.map === 'type1') : false
  return srvGetTargetDetailByReference(req.params).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: mapping ? mappingObjectTargetDetail(rs.rows) : rs.rows,
      total: rs.count
    })
  }).catch(er => next(new ApiError(400, er.message)))
}

exports.ctlGetTarget = function (req, res, next) {
  if(req.params.type === 'header') {
    return ctlGetTargetHeader(req,res,next)
  } else if (req.params.type === 'detail') {
    return ctlGetTargetDetail(req, res, next)
  }
}

exports.ctlInsertTarget = async function (req, res, next) {
  console.log('Requesting-ctlInsertTarget: ' + JSON.stringify(req.url) + '...')
  let condition = true
  const transaction = await sequelize.transaction()
  try{
    const userLogIn = extractTokenProfile(req)
    let details = []
    let dataHeader = []
    let checkExist = ''
    const { data, storeCode } = req.body
    let store = await srvGetStoresByCode(storeCode)
    const stores = JSON.parse(JSON.stringify(store))
    if(stores && (data || []).length > 0) {
      const createdAt = new Date()
      for(let x in data) {
        const { rangeTarget, detail } = data[x]
        checkExist = await srvCheckExistTargetHeader(stores.id, rangeTarget, next)
        if(!checkExist) {
          dataHeader.push({
            storeId: stores.id,
            startDate: moment(rangeTarget[0]).startOf('month').format('YYYY-MM-01'),
            endDate: moment(rangeTarget[1]).endOf('month').format('YYYY-MM-DD'),
            createdBy: userLogIn.userid,
            createdAt
          })
          if(detail.length > 0) {
            let temp = []
            for(let z in detail) {
              let { categoryCode, items } = detail[z]
              if(items.length > 0) {
                const category = await srvGetStocksCategoryByCode(categoryCode)
                // temp.category = category
                for(let y in items) {
                  const { brandCode, brandName, ...other } = items[y]
                  const brand = await srvGetStocksBrandByCode(brandCode)
                  temp.push({
                    brandId: brand.id,
                    storeCode: stores.storeCode,
                    storeName: stores.storeName,
                    brandCode: brand.brandCode,
                    brandName: brand.brandName,
                    categoryCode: category.categoryCode,
                    categoryId: category.id,
                    categoryName: category.categoryName,
                    createdBy: userLogIn.userid,
                    createdAt,
                    ...other
                  })
                }
              } else {
                throw new Error('AFC-TGM001: data items cannot be null or empty')
              }
            }
            details.push(temp)
          } else {
            throw new Error('AFC-TGM002: data detail cannot be null or empty')
          }
        } else {
          condition = false
          throw new Error(`AFC-TGM003: range target of ${rangeTarget.join(' ~ ')}, has been exists`)
        }
      }
      
      if(condition) {
        const miscTarget = JSON.parse(JSON.stringify(await getMiscByCode('OTHERTARGET')))
        const _headers = await srvCreateTargetHeader(dataHeader, next, transaction)
        const header = JSON.parse(JSON.stringify(_headers))
        let dataDetails = []
        let createDetail = []
        let otherTarget = []
        for(let x in header) {
          const { id, startDate, endDate } = header[x]
          const collapseDate = `${header[x].startDate},${header[x].endDate}`
          const tmpData = data.filter(item => item.rangeTarget.join(',') === collapseDate)[0] || {}
          for(let z in miscTarget) {
            otherTarget.push({
              referenceid: id,
              value: tmpData[miscTarget[z].miscName] || 0,
              typeval: miscTarget[z].id
            })
          }

          for(let y in details[x]) {
            let tmpDetails = { referenceId: id, startDate, endDate, ...details[x][y] }
            dataDetails.push(tmpDetails)
            createDetail.push({
              referenceId: id,
              categoryId: details[x][y].categoryId,
              brandId: details[x][y].brandId,
              targetSalesQty: details[x][y].targetSalesQty,
              targetSalesValue: details[x][y].targetSalesValue,
              createdBy: details[x][y].createdBy
            })
          }
        }
        const other = await srvCreateTargetOther(otherTarget, next, transaction)
        const detail = await srvCreateTargetDetail(createDetail, next, transaction)
        await transaction.commit()
        res.xstatus(200).json({success: true,  created: mappingObjectTargetDetail(dataDetails)})
          
      }
    } else {throw new Error(`AFC-TGM004: data & store cannot be null or empty ..`)}
  } catch (er) {
    await transaction.rollback()
    next(new ApiError(400, er.message))
  }
}

exports.ctlModifyTarget = function (req,res, next) {
  console.log('Requesting-ctlModifyTarget: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  const userLogIn = extractTokenProfile(req)
  return srvModifyTarget(req.body, userLogIn.userid).then(modifier => {
    res.xstatus(200).json({
      success: true,
      data: modifier.value
    })
  }).catch(er => next(new ApiError(400, er.message)))
}