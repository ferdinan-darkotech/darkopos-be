import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetStocksBrand } from '../../../../services/v2/master/stocks/srvStocksBrand'

exports.ctlGetStocksBrand = function (req, res, next) {
  console.log('Requesting-ctlGetStocksBrand: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  const pagination = {
    page: req.query.page || 1,
    pageSize: req.query.pageSize || 10
  }
  try{
    srvGetStocksBrand(req.query).then((stockBrand) => {
      res.send({
        success: true,
        data: stockBrand.rows,
        total: stockBrand.count,
        ...pagination
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}