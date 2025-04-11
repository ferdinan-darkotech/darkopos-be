import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
    setPurchaseInfo, getPurchaseByCode, purchaseExists, getPurchaseData, srvReceiveStockPurchase,
    createPurchase, getLastTrans, updatePurchase, deletePurchase, getPurchaseByReference,
    srvGetTransitData
}
from '../services/purchaseService'
import { getSettingByCodeV2 } from '../services/settingService'
import { srvFindDataByPayloadType } from '../services/v2/monitoring/srvApproval'
import { getStoreQuery } from '../services/setting/storeService'
import { srvGetSomeProductById } from '../services/stockService'
import { srvGetSomeStockOnHand } from '../services/v2/inventory/srvStocks'
import { extractTokenProfile } from '../services/v1/securityService'
import { checkStockMinus } from '../services/Report/fifoReportService'
import moment from 'moment'

// Retrive list a purchase
exports.getPurchase = function (req, res, next) {
    console.log('Requesting-getPurchase: ' + req.url + ' ...')
    // var transNo = req.params.id
    const { transNo } = req.params
    getPurchaseByCode(transNo, req.query).then((Purchase) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            purchase: Purchase
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Purchase ${transNo}.`, err)))
}

// Retrive list of purchase
exports.getAllPurchase = function (req, res, next) {
    console.log('Requesting-getAllPurchase: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    getPurchaseData(other).then((purchase) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            total: purchase.count,
            data: purchase.rows
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Purchase.`, err)))
}

exports.getLast = function (req, res, next) {
    console.log('Requesting-getLast: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    getLastTrans(other).then((purchase) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(purchase)),
            total: purchase.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Transaction.`, err)))
}

// Create a new purchase
exports.insertPurchase = function (req, res, next) {
    console.log('Requesting-insertPurchases:' + req.url + ' ...')
    // var transNo = req.body.id
    let purchaseBody = req.body
    const userLogIn = extractTokenProfile(req)
    // purchaseExists(transNo).then(exists => {
    // if (exists) {
    //     next(new ApiError(409, `PURCHASE already exists.`))
    // } else {
    const prodId = (purchaseBody.add || []).map(i => i.productId)
    if(!purchaseBody.data.reference) {
        next(new ApiError(501, `Couldn't create purchase.`, 'Reference cannot be null or empty'))
    } else {
        return srvFindDataByPayloadType ('PURCHASE', 'reference', purchaseBody.data.reference, ['P']).then(approvalExists => {
            if(approvalExists) {
                throw new Error(`The transaction is pending approval, please contact the related person`)
            } else {
                return getPurchaseByReference(purchaseBody.data.reference).then(async existsRefrence => {
                    if(existsRefrence) { throw new Error('Reference has been exists') }
                    else {
                        return srvGetSomeStockOnHand(prodId, purchaseBody.data.storeId).then(prod => {
                            if(prod.length !== purchaseBody.add.length) throw new Error('Please re-check your detail transaction.')
                            const tmpDetail = prod.map((i, x) => {
                                const dataBody = purchaseBody.add.filter(n => n.productId === i.productcode)[0]
                                return { ...dataBody, productId: i.productid }
                            })
                            purchaseBody.add = tmpDetail
                            return createPurchase(purchaseBody, userLogIn.userid, next).then((purchaseCreated) => {
                                // return getPurchaseByCode(purchaseCreated).then((purchaseByCode) => {
                                    //let purchaseInfo = setPurchaseInfo(purchaseByCode.dataValues)
                                    if(purchaseCreated.success) {
                                        let jsonObj = {
                                            success: true,
                                            message: `PURCHASE of ${purchaseCreated.transNo} created`,
                                            approval: purchaseCreated.approval,
                                            appvno: purchaseCreated.appvno
                                        }
                                        // if (project.message_detail === 'ON') {
                                        //     Object.assign(jsonObj, { purchase: purchaseInfo })
                                        // }
                                        res.xstatus(200).json(jsonObj)
                                    } else {
                                        throw new Error(purchaseCreated.message)
                                    }
                                    
                                //}).catch(err => next(new ApiError(422, err + `Couldn't find purchase ${purchaseInfo.transNo}.`, err)))
                            }).catch(err => next(new ApiError(501, `Couldn't create purchase.`, err)))
                        }).catch(err => next(new ApiError(501, `Couldn't create purchase.`, err)))
                    }
                }).catch(err => next(new ApiError(501, `Couldn't create purchase.`, err)))
            }
        }).catch(err => next(new ApiError(501, `Couldn't create purchase.`, err)))
    }
}

//Update Purchase
exports.updatePurchase = function (req, res, next) {
    console.log('Requesting-updatePurchase: ' + req.url + ' ...')
    
    // add akan terpengaruh
    var transNo = req.body.id
    let purchaseBody = req.body
    const storeId = (purchaseBody.data || {}).storeId
    const userLogIn = extractTokenProfile(req)
    const checkProductCost = []
    if(!purchaseBody.data.reference) {
        next(new ApiError(501, `Couldn't create purchase.`, 'Reference cannot be null or empty'))
    } else {
        return srvFindDataByPayloadType ('PURCHASE', 'reference', purchaseBody.data.reference, ['P']).then(approvalExists => {
            if(approvalExists) {
                throw new Error(`The transaction is pending approval, please contact the related person`)
            } else {
                return getPurchaseByReference(purchaseBody.data.reference, transNo).then(async existsRefrence => {
                    if(existsRefrence) { throw new Error('Reference has been exists') }
                    else {
                        // const sett = await getSettingByCodeV2('Validation')
                        // const { settingvalue = {} } = (sett || {})
                        let newQuery = { intransit: true }
                        return getPurchaseByCode(transNo, newQuery, true).then(async purchaseExists => {
                            if(Math.abs(moment(moment((purchaseExists || {}).createdAt).format('YYYY-MM')).diff(moment().format('YYYY-MM'), 'month')) <= 0) {
                                if ((purchaseExists || {}).id) {
                                const purchaseDetail = [...purchaseBody.add, ...purchaseBody.edit]
                                const codeProduct = purchaseDetail.map(i => i.productCode)
                                let purchaseAdd = []
                                let purchaseEdit = []
                                let purchaseVoid = []
                                let mappingProduct = {}
                                const storeDetail = await getStoreQuery({id: storeId}, 'storebyid')
                                return srvGetSomeStockOnHand(codeProduct, purchaseBody.data.storeId).then(prod => {
                                    if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
                                    const tmpDetail = prod.map((i, x) => {
                                    const dataBodyAdd = purchaseBody.add.filter(n => n.productCode === i.productcode)[0]
                                    const dataBodyEdit = purchaseBody.edit.filter(n => n.productCode === i.productcode)[0]
                                    // const dataBodyVoid = purchaseBody.void.filter(n => n.productCode === i.productcode)[0]
                                    
                                    if(dataBodyAdd) {
                                        purchaseAdd.push({ ...dataBodyAdd, productId: i.productid })
                                    } else if (dataBodyEdit) {
                                        purchaseEdit.push({ ...dataBodyEdit, productId: i.productid })
                                        mappingProduct[i.productid] =  dataBodyEdit.qty
                                    } else if (dataBodyVoid) {
                                        purchaseVoid.push({ ...dataBodyVoid, productId: i.productid })
                                        purchaseEdit.push({
                                            ...dataBodyVoid, productId: i.productid, void: 1, qty: 0, DPP: 0, PPN: 0, void: 1,
                                            discPercent: 0, discNominal: 0, purchasePrice: 0
                                        })
                                        mappingProduct[i.productid] =  dataBodyVoid.qty
                                    }
                                    return
                                    })
                                    purchaseBody.add = purchaseAdd
                                    purchaseBody.edit = purchaseEdit
                                    purchaseBody.void = purchaseVoid
                                    const packChecking = {
                                        transno: transNo,
                                        storeid: storeId,
                                        product: mappingProduct,
                                        purchaseBody
                                    }
                                    
                                    return checkStockMinus(packChecking,'PURCHASE', next).then(check => {
                                        if(!check.STATUS || check.STATUS === 'N') throw new Error(check.RESULT)
                                        return updatePurchase(transNo, purchaseBody, userLogIn.userid, next, res).then((purchaseUpdated) => {
                                            if (purchaseUpdated) {
                                                // return getPurchaseByCode(transNo).then((purchaseByCode) => {
                                                    // const purchaseInfo = setPurchaseInfo(purchaseByCode)
                                                    let jsonObj = {
                                                        success: true,
                                                        message: `PURCHASE of ${transNo} updated`,
                                                        approval: purchaseUpdated.approval,
                                                        appvno: purchaseUpdated.appvno
                                                    }
                                                    // if (project.message_detail === 'ON') {
                                                    //     Object.assign(jsonObj, { purchase: purchaseInfo })
                                                    // }
                                                    res.xstatus(200).json(jsonObj)
                                                // }).catch(err => next(new ApiError(501, `Couldn't update PURCHASE ${transNo}.`, err)))
                                            }
                                        }).catch(err => next(new ApiError(422, `Couldn't find PURCHASE ${transNo}.`, err)))
                                    }).catch(err => next(new ApiError(422, err.message, err)))
                                    }).catch(err => next(new ApiError(501, `Couldn't find product.`, err)))
                                } else {
                                    next(new ApiError(422, `Invoice ${transNo} has been receive.`))
                                }
                            } else {
                                return next(new ApiError(422, `Out of month.`, 'Period has been ended ...'))
                            }
                        }).catch(err => next(new ApiError(422, `Couldn't find PURCHASE ${transNo} .`, err)))
                    }
                }).catch(err => next(new ApiError(422, `Reference has been exists .`, err)))
            }
        }).catch(err => next(new ApiError(501, `Couldn't create purchase.`, err)))
    }
}

//Delete a Purchase
exports.deletePurchase = function (req, res, next) {
    console.log('Requesting-deletePurchase: ' + req.url + ' ...')
    let transNo = req.params.id
    purchaseExists(transNo).then(exists => {
        if (exists) { 
            return deletePurchase(transNo).then((purchaseDeleted) => {
                if (purchaseDeleted === 1) {
                    let jsonObj = {
                        success: true,
                        message: `Purchase ${transNo} deleted`,
                    }
                    if (project.message_detail === 'ON') {
                        Object.assign(jsonObj, { purchase: purchaseDeleted })
                    }
                    res.xstatus(200).json(jsonObj)
                } else {
                    next(new ApiError(422, `Purchase ${transNo} fail to delete.`))
                }
            }).catch(err => next(new ApiError(500, `Couldn't delete purchase ${transNo}.`, err)))
        } else {
            next(new ApiError(422, `Purchase ${transNo} not exists.`))
        }
    }).catch(err => next(new ApiError(422, `PURCHASE ${transNo} not exists.`, err)))
}