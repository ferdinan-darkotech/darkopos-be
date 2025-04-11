/**
 * Created by Veirry on 29/09/2017.
 */
import { ApiError } from '../../services/v1/errorHandlingService'
import project from '../../../config/project.config'
import sequelize from '../../native/sequelize'
import { srvGetRecapStockFifo } from '../../services/v2/report/srvFifo'
import { extractTokenProfile } from '../../services/v1/securityService'

exports.getReportSummaryFifo = function (req, res, next) {
    console.log('Requesting-getReportSummaryFifo: ' + req.url + ' ...')
    const userLogin = extractTokenProfile(req)
    return srvGetRecapStockFifo(req.query, userLogin.userid).then(fifo => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: fifo[0],
            total: fifo[0].length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
}

exports.getReportValueFifo = function (req, res, next) {
    console.log('Requesting-getReportValueFifo: ' + req.url + ' ...')
    let { ...other } = req.query
    sequelize.query('select * from sp_nilai_persediaan_fifo (:period, :year, :store);',
        { replacements: { period: other.period, year: other.year, store: other.store } }).then((pos) => {
            res.xstatus(200).json({
                success: true,
                message: 'Ok',
                data: pos[0],
                total: pos[0].length
            })
        }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
}

exports.getBalanceFifo = function (req, res, next) {
    console.log('Requesting-getBalanceFifo: ' + req.url + ' ...')
    let { ...other } = req.query
    sequelize.query('select * from sp_saldo_stock (:from, :to, :store);',
        { replacements: { from: other.from, to: other.to, store: other.storeId } }).then((pos) => {
            res.xstatus(200).json({
                success: true,
                message: 'Ok',
                data: pos[0],
                total: pos[0].length
            })
        }).catch(err => {
            console.log(err)
            next(new ApiError(501, err + ` - Couldn't find Report.`, err))
        })
}

exports.getBalanceFifoProduct = function (req, res, next) {
  console.log('Requesting-getBalanceFifoProduct: ' + req.url + ' ...')
  let { ...other } = req.query
  sequelize.query('select * from sp_saldo_stock_003 (:from, :to, :store, :product);',
    { replacements: { from: other.from, to: other.to, store: other.storeId, product: other.product } }).then((pos) => {
      res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: pos[0],
          total: pos[0].length
      })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

exports.getStockCardFifo = function (req, res, next) {
    console.log('Requesting-getStockCardFifo: ' + req.url + ' ...')
    let { ...other } = req.query
    sequelize.query('select * from sp_kartu_stok_fifo (:period, :year, :productCode, :productName, :store);',
        { replacements: { period: other.period, year: other.year, productCode: other.productCode, productName: other.productName, store: other.store } }).then((pos) => {
            res.xstatus(200).json({
                success: pos ? true : false,
                message: 'Ok',
                data: pos[0],
                total: pos[0] ? pos[0].length : 0
            })
        }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
}

exports.getTransferFifo = function (req, res, next) {
    console.log('Requesting-getTransferFifo: ' + req.url + ' ...')
    let { ...other } = req.query
    sequelize.query('select * from sp_transfer_flow (:period, :year, :store);',
        { replacements: { period: other.period, year: other.year, store: other.storeId } }).then((data) => {
            res.xstatus(200).json({
                success: true,
                message: 'Ok',
                total: data[0].length,
                data: data[0]
            })
        }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
}
