// [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetStocksGroup } from '../../../../services/v2/master/stocks/srvStocksGroup'

exports.ctlGetStockItems = function (req, res, next) {
  console.log('Requesting-ctlGetStockItems: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  
}

exports.ctlGetStocksGroup = function (req, res, next) {
  console.log('Requesting-ctlGetStocksGroup: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  const pagination = {
    page: +req.query.page || 1,
    pageSize: +req.query.pageSize || 10
  }
  try{
    srvGetStocksGroup(req.query).then((stockGroup) => {
      res.send({
        success: true,
        data: stockGroup.rows,
        total: stockGroup.count,
        ...pagination
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}