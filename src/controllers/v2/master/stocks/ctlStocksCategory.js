import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetStocksCategory } from '../../../../services/v2/master/stocks/srvStocksCategory'

exports.ctlGetStockItems = function (req, res, next) {
  console.log('Requesting-ctlGetStockItems: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  
}

exports.ctlGetStocksCategory = function (req, res, next) {
  console.log('Requesting-ctlGetStocksCategory: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  const pagination = {
    page: +req.query.page || 1,
    pageSize: +req.query.pageSize || 10
  }
  try{
    srvGetStocksCategory(req.query).then((stockCategory) => {
      res.send({
        success: true,
        data: stockCategory.rows,
        total: stockCategory.count,
        ...pagination
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}