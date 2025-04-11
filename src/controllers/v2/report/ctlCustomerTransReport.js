import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  srvCustomerServicesTrans, srvCustomerServiceTransByTypes,
  srvCustomerServiceTransByGroups, srvFrequenceCustomerServices,
  srvCustomerServiceAndProduct, srvCustomerServiceByUnit,
  srvCustomerTransByPackageBundling, srvCustomersVerified,
  srvSumCustomerCoupon, srvSumLastVisitCustomer
} from '../../../services/v2/report/srvCustomerTransReport'
import { extractTokenProfile } from '../../../services/v1/securityService'


export function ctlCustomerSalesReport (req,res,next) {
  console.log('Requesting-ctlCustomerSalesReport: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
    let reportServices = null
    
    switch (req.params.code) {
      case 'rpt_customer_visit':
        reportServices = srvCustomerServicesTrans
        break
      case 'rpt_customer_type':
        reportServices = srvCustomerServiceTransByTypes
        break
      case 'rpt_customer_group':
        reportServices = srvCustomerServiceTransByGroups
        break
      case 'rpt_frequence_service':
        reportServices = srvFrequenceCustomerServices
        break
      case 'rpt_sum_trans_service_x_product':
        reportServices = srvCustomerServiceAndProduct
        break
      case 'rpt_sales_by_unit':
        reportServices = srvCustomerServiceByUnit
        break
      case 'rpt_package_bundling':
        reportServices = srvCustomerTransByPackageBundling
        break
      case 'rpt_verified_customer':
        reportServices = srvCustomersVerified
        break
      case 'rpt_sum_customer_coupon':
        reportServices = srvSumCustomerCoupon
        break
      case 'rpt_sum_customer_last_visit_by_range':
        reportServices = srvSumLastVisitCustomer
          break
      default:
        break
    }

    if(!reportServices) {
      throw new Error()
    }

    return reportServices(req.body, userLogIn.userid).then(result => {
      res.xstatus(200).json({
        success: true,
        data: result[0],
        message: 'OK'
      })
    }).catch(er => {
      res.xstatus(400).json({
        success: false,
        message: 'Report is not defined.',
        detail: er.message
      })
    })
}