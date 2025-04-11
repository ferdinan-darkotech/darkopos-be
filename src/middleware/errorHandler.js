import { logException } from '../services/v1/errorHandlingService'

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ApiError') {
    const errorId = logException(err.details);
    // res.xstatus(err.code).json({id: errorId, success: false, message: err.message, detail: err.details.toString().split('\n')[0]}).end()
    res.xstatus(err.code).json({
      id: errorId,
      success: false,
      message: err.message,
      detail: err.details
      // detail: err.details.toString().split('\n')[0]
    })
  }
  else
    next(err)
}

export default errorHandler
