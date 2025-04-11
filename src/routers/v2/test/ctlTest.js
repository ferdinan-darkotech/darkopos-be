import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetCities, srvGetCityById, srvGetCityByCode, srvCityExist,
  srvCreateCity, srvUpdateCity, srvDeleteCity }
  from '../../../services/v2/master/general/srvCity'
import { extractTokenProfile } from '../../../services/v1/securityService'

exports.getTest = function (req, res, next) {
  console.log('Requesting-getTest: ' + req.url + ' ...')
  res.xstatus(200).json({
      success: true,
      message: 'Ok'
    })
}

exports.getTest400 = function (req, res, next) {
  console.log('Requesting-getTest400: ' + req.url + ' ...')
  res.xstatus(400).json({
      success: false,
      message: 'Ok',
      message: 'Cannot delete or update a parent row: a foreign key constraint fails',
      detail: [
        {
            "type": "SequelizeForeignKeyConstraintError",
            "message": "fk_member_city"
        }
      ]
    })
}