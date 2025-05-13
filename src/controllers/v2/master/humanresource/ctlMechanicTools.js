const { ApiError } = require("../../../../services/v1/errorHandlingService")
const { fetchMechanics } = require("../../../../services/v2/master/humanresource/srvMechanicTools")

const getMechanics = function (req, res, next, comment = 'getMechanics') {
    console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  
    fetchMechanics(req.query).then((mechanic) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        data: mechanic
      })
    }).catch(err => next(new ApiError(422, `ZCEP-00001: Couldn't find getMechanics`, err)))
}

module.exports = {
  getMechanics
}