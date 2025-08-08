import utilsRouter from './v1/utilsRouter'
import menuRouter from './v1/menuRouter'
import sequenceRouter from './v1/sequenceRouter'
import sequencesRouter from './v1/sequencesRouter'
import miscRouter from './v1/miscRouter'
import settingRouter from './v1/settingRouter'
import bankRouter from './v1/master/bankRouter'
import paymentMasterOptionRouter from './v1/master/paymentMasterOptionRouter'
import supplierBankRouter from './v1/master/supplierBankRouter'
import storeRouter from './v1/storeRouter'

import cloudinaryRouter from './v1/cloudinary/cloudinaryRouter'

import userRouter from './v1/usersRouter'

import memberBirthRouter from './v1/member/memberBirthRouter'
import memberAssetBrandRouter from './v1/member/utilities/memberAssetBrandRouter'
import memberAssetModelRouter from './v1/member/utilities/memberAssetModelRouter'
import memberAssetTypeRouter from './v1/member/utilities/memberAssetTypeRouter'
import memberAssetCategoryRouter from './v1/member/utilities/memberAssetCategoryRouter'

import memberUnitMaintenanceRouter from './v1/maintenance/memberUnitMaintenanceRouter'

import memberAssetRouter from './v1/master/assetSpesification'

import supplierRouter from './v1/suppliersRouter'

import stockRouter from './v1/product/stockRouter'
import stockBrandRouter from './v1/product/stockBrandRouter'
import stockCategoryRouter from './v1/product/stockCategoryRouter'
import variantRouter from './v1/product/variantRouter'
import stockVariantRouter from './v1/product/stockVariantRouter'
import specificationRouter from './v1/product/specificationRouter'
import stockSpecificationRouter from './v1/product/stockSpecificationRouter'
import stockBeginRouter from './v1/stockBeginRouter'
import stockPeriodRouter from './v1/stockPeriodRouter'

import posRouter from './v1/posRouter'
import adjustRouter from './v1/adjustRouter'
import posDetailRouter from './v1/posDetailRouter'
import mutasiInRouter from './v1/mutasiInRouter'
import mutasiOutRouter from './v1/mutasiOutRouter'
import mutasiOutDetailRouter from './v1/mutasiOutDetailRouter'
import mutasiInDetailRouter from './v1/mutasiInDetailRouter'
import transferOutDetailHpokokRouter from './v1/transferOutDetailHpokokRouter'
import transferOutHeaderRouter from './v1/transferOutHeaderRouter'
import purchaseRouter from './v1/purchaseRouter'
import periodRouter from './v1/periodRouter'
import purchaseDetailRouter from './v1/purchaseDetailRouter'

import paymentRouter from './v1/payment/paymentRouter'
import paymentPayableRouter from './v1/payment/paymentPayableRouter'
import paymentReportRouter from './v1/Report/paymentReportRouter'
import payableReportRouter from './v1/Report/payableReportRouter'
import marketingReportRouter from './v1/Report/marketingReportRouter'
import paymentOptionRouter from './v1/payment/paymentOptionRouter'

import serviceRouter from './v1/serviceRouter'

import cashierTransRouter from './v1/cashierTransRouter'
import cashierCounterRouter from './v1/cashier/counterRouter'
import cashierShiftRouter from './v1/cashier/shiftRouter'
import cashierUserRouter from './v1/cashier/userRouter'
import cashierCashRegisterRouter from './v1/cashier/cashRegisterRouter'
import transactionsRouter from './v1/cashier/transactionsRouter'
import accountCodeRouter from './v1/cashier/accountCodeRouter'
import cashEntryTypeRouter from './v1/cashier/cashEntryTypeRouter'
import cashEntryRouter from './v1/cashier/cashEntryRouter'
import bankEntryRouter from './v1/cashier/bankEntryRouter'

import purchaseReport from './v1/Report/purchaseReportRouter'
import serviceReport from './v1/Report/serviceReportRouter'
import adjustReport from './v1/Report/adjustReportRouter'
import posReport from './v1/Report/posReportRouter'
import fifoReport from './v1/Report/fifoReportRouter'
import memberCashbackReportRouter from './v1/Report/memberCashbackReportRouter'
import transferReport from './v1/Report/transferReportRouter'
import toolsReport from './v1/Report/toolsReportRouter'
import cashEntryReport from './v1/Report/cashEntryReportRouter'
import bundlingReport from './v1/Report/bundlingReportRouter'
import woReportRouter from './v1/Report/woReportRouter'

import mobileMembersRouter from './v1/mobile/membersRouter'
import mobileBookingRouter from './v1/mobile/bookingRouter'
import mobileOutletRouter from './v1/mobile/outletRouter'
import mobileImageRouter from './v1/mobile/appImageRouter'

import dashboardRouter from './v1/dashboard/headerRouter'

import timeRouter from './v1/setting/timeRouter'
import sellPriceRouter from './v1/tools/changeSellPriceRouter'

// import permissionRouter from './v1/permission/permissionRouter'
// import roleRouter from './v1/permission/roleRouter'
// import permissionRoleRouter from './v1/permission/permissionRoleRouter'

import memberSocialRouter from './v1/social/memberSocialRouter'

import loyaltyRouter from './v1/loyalty/loyaltyRouter'
import memberCashbackRouter from './v1/loyalty/memberCashbackRouter'

import promoRouter from './v1/marketing/promoRouter'
import targetRouter from './v1/marketing/targetRouter'

import bundlingRouter from './v1/master/bundlingRouter'
import bundlingRulesRouter from './v1/master/bundlingRulesRouter'
import bundlingRewardRouter from './v1/master/bundlingRewardRouter'

import followUpMain from './v1/monitoring/followUpMainRouter'
import followUpHeader from './v1/monitoring/followUpHeaderRouter'
import followUpDetail from './v1/monitoring/followUpDetailRouter'

import woRouter from './v1/service/workOrder/woRouter'
import woDetailRouter from './v1/service/workOrder/woDetailRouter'
import woFieldRouter from './v1/service/workOrder/woFieldRouter'
import woCheckRouter from './v1/service/workOrder/woCheckRouter'
import woCategoryRouter from './v1/service/workOrder/woCategoryRouter'
import woMainRouter from './v1/service/workOrder/woMainRouter'

import logReportRouter from './v1/log/logReportRouter'


//// v2
import { City, SocialMedia, InsentiveRoles, Vendor } from './v2/master/general'
import { FinancialProvider, PaymentOption, EDCMachine, COA } from './v2/master/finance'
import { JobPosition, Employee } from './v2/master/humanresource'
import { CustomerGroup, CustomerType, CustomerList, CustomerAsset, CustomerCashback, CustomerCategory, CustomerLOV } from './v2/master/customer'
import { Store } from './v2/master/store'

import otherRouter from './v2/test/rtrTest'

//temporary open
import cityRouter from './v1/cityRouter'
import employeeRouter from './v1/employeeRouter'
import employeePositionRouter from './v1/employeePositionRouter'
import memberTypeRouter from './v1/member/memberTypeRouter'
import memberGroupRouter from './v1/member/memberGroupsRouter'
import memberRouter from './v1/member/memberRouter'
import socialRouter from './v1/social/socialRouter'
//temporary open

import { saleReport, reportLists, reportIndents, reportCustomerTrans, customReport } from './v2/report'
import { stocksBrand, stocksCategory, rolesDiscount, masterProductTradeIn, shelfs, stocksGroup } from './v2/master/stocks'
import { salesTarget, salesRealization, followUpCustomerV2, bundlingV2, NPSV2 } from './v2/marketing'
import { StocksV2, RequestOrder } from './v2/inventory'
import { OSRequest, Approval, Warranty } from './v2/monitoring'

import CustomerAchievements from './v2/master/SetupCustomerCoupon/rtrCustomerAchievements'
import CustomerRewards from './v2/master/SetupCustomerCoupon/rtrCustomerRewards'
import area from './v2/master/area'
import voucher from './v2/master/voucher'
import voucherPackage from './v2/master/voucherPackage'
import { voucherSales, spkForm, Indent, CustomerCoupon, PurchaseV2, SalesProductTradeIN, SalesV2 } from './v2/transaction'


import { notificationType, notificationTimer, notificationGroup, notificationTemplate, notificationProposal, notificationLog, notificationWA } from './v2/notification'
import { accessGranted, nativeQueryStrings, integrationSystems, globalVariables, userCredentialsV2 } from './v2/setting'
import { PackLov, UtilitiesV2 } from './v2/other'
import { Wilayah, Department, Division } from './v2/master/other'

import AdsBanner from './v2/other/DataLov/rtrAdsBanner'


import { CashEntryV2, CashEntryBalanceV2 } from './v2/finance'

import { LogProcessRequest } from './v2/logs'

// [NEW]: FERDINAN - 2025-03-06
import requestStockOutRouter from './v2/transaction/rtrRequestStockOut'

// [MECHANIC TOOLS]: FERDINAN - 2025-05-13
import mechanicRouter from './v2/master/humanresource/rtrMechanicTools'

// [MASTER PRODUCT GROUP]: FERDINAN - 16/06/2025
import stockGroupRouter from './v1/product/stockGroupRouter'

// [MPWA CONNECT]: FERDINAN - 31/08/2025
import mpwaRouter from './v2/mpwa/rtrMpwa'

/// v2

const routes = (app) => {
  app.use(utilsRouter)
  app.use(menuRouter)
  app.use(sequenceRouter)
  app.use(sequencesRouter)
  app.use(miscRouter)
  app.use(settingRouter)
  app.use(bankRouter)
  app.use(paymentMasterOptionRouter)
  app.use(supplierBankRouter)

  app.use(userRouter)
  app.use(storeRouter)

  app.use(cloudinaryRouter)

  app.use(memberBirthRouter)
  app.use(memberAssetBrandRouter)
  app.use(memberAssetModelRouter)
  app.use(memberAssetTypeRouter)
  app.use(memberAssetCategoryRouter)

  app.use(memberUnitMaintenanceRouter)

  app.use(memberAssetRouter)

  app.use(supplierRouter)

  app.use(stockBrandRouter)
  app.use(stockCategoryRouter)
  app.use(stockRouter)
  app.use(variantRouter)
  app.use(stockVariantRouter)
  app.use(specificationRouter)
  app.use(stockSpecificationRouter)
  app.use(stockBeginRouter)
  app.use(stockPeriodRouter)

  app.use(posRouter)
  app.use(adjustRouter)

  app.use(posDetailRouter)

  app.use(purchaseRouter)

  app.use(mutasiInDetailRouter)
  app.use(mutasiInRouter)
  app.use(mutasiOutDetailRouter)
  app.use(mutasiOutRouter)
  app.use(transferOutDetailHpokokRouter)
  app.use(transferOutHeaderRouter)


  app.use(paymentRouter)        // 05/02/2018
  app.use(paymentPayableRouter) // 05/02/2018
  app.use(payableReportRouter)  // 13/06/2018
  app.use(marketingReportRouter)
  app.use(paymentReportRouter)  // 17/04/2018
  app.use(paymentOptionRouter)  // 26/02/2018

  app.use(periodRouter)

  app.use(purchaseDetailRouter)

  app.use(serviceRouter)

  app.use(cashierTransRouter)
  app.use(cashierCounterRouter)
  app.use(cashierShiftRouter)
  app.use(cashierUserRouter)
  app.use(cashierCashRegisterRouter)
  app.use(transactionsRouter)
  app.use(accountCodeRouter)
  app.use(cashEntryTypeRouter)
  app.use(cashEntryRouter)
  app.use(bankEntryRouter)

  app.use(purchaseReport)
  app.use(serviceReport)
  app.use(posReport)
  app.use(adjustReport)
  app.use(fifoReport)
  app.use(memberCashbackReportRouter)
  app.use(transferReport)
  app.use(toolsReport)
  app.use(cashEntryReport)
  app.use(bundlingReport)
  app.use(woReportRouter)

  app.use(mobileMembersRouter)
  app.use(mobileBookingRouter)
  app.use(mobileBookingRouter)
  app.use(mobileOutletRouter)
  app.use(mobileImageRouter)

  app.use(dashboardRouter)

  app.use(timeRouter)
  app.use(sellPriceRouter)

  // app.use(permissionRouter)
  // app.use(roleRouter)
  // app.use(permissionRoleRouter)

  app.use(memberSocialRouter)

  app.use(loyaltyRouter)
  app.use(memberCashbackRouter)

  app.use(promoRouter)

  app.use(targetRouter)

  app.use(bundlingRouter)
  app.use(bundlingRulesRouter)
  app.use(bundlingRewardRouter)

  app.use(followUpMain)
  app.use(followUpHeader)
  app.use(followUpDetail)

  app.use(woRouter)
  app.use(woDetailRouter)
  app.use(woFieldRouter)
  app.use(woCheckRouter)
  app.use(woCategoryRouter)
  app.use(woCategoryRouter)
  app.use(woMainRouter)

  app.use(logReportRouter)

//// v2
  // begin:master-finance
  app.use(PaymentOption)               // 20190315
  app.use(FinancialProvider)           // 20190320
  app.use(EDCMachine)                  // 20190406
  app.use(Wilayah)                      // 20201008
  app.use(Division)                      // 20210615
  app.use(Department)                      // 20210615
  app.use(COA)                          // 20201123
  // master-finance:end

  // begin:master-human resource
  app.use(Employee)                    // 20190423
  app.use(JobPosition)                 // 20190430
  app.use(employeeRouter)
  app.use(employeePositionRouter)
  // master-human resource:end

  // begin:master-customer
  app.use(CustomerGroup)               // 20190502
  app.use(CustomerType)                // 20190502
  app.use(CustomerList)                // 20190507
  app.use(CustomerAsset)               // 20190507
  app.use(CustomerCashback)            // 20190619
  app.use(memberGroupRouter)
  app.use(memberTypeRouter)
  app.use(memberRouter)
  app.use(CustomerCategory)            // 20200717
  app.use(CustomerLOV)                  // 20230126
  // master-customer:end

  // begin:master-city
  app.use(City)                        // 20190429
  app.use(SocialMedia)                 // 20190514
  app.use(InsentiveRoles)              // 20200716
  app.use(Vendor)                     // 20220805
  app.use(cityRouter)
  app.use(socialRouter)
  app.use(area)
  app.use(CustomerAchievements)
  app.use(CustomerRewards)
  app.use(voucher)
  app.use(voucherPackage)
  // master-city:end

  // begin: store
  app.use(Store)                        // 20190717
  // end: store

  // begin:test
  app.use(otherRouter)                 //20190430
  // test:end

  // begin:report
  app.use(saleReport)
  app.use(reportIndents)
  app.use(reportLists)
  app.use(reportCustomerTrans)
  app.use(customReport)           // 202220907
  // end:report

  // begin:sales
  app.use(voucherSales)            // 20200309
  app.use(spkForm)                // 20200806
  app.use(Indent)                 // 20210706
  app.use(CustomerCoupon)         // 20210812
  app.use(PurchaseV2)             // 20210927
  app.use(SalesV2)                // 20230220
  app.use(SalesProductTradeIN)    // 20220822
  // end:sales

  // begin: stocks
  app.use(stocksBrand)              // 20190904
  app.use(stocksCategory)           // 20190904
  app.use(rolesDiscount)            // 20200805
  app.use(masterProductTradeIn)     // 20220809
  app.use(shelfs)                   // 20220321
  // end: stocks

  // begin:marketing
  app.use(salesTarget)             //20190812
  app.use(salesRealization)        //20190822
  app.use(followUpCustomerV2)      //20201022
  app.use(bundlingV2)              //20220412
  app.use(NPSV2)                   //20230224
  // end:marketing
  
  // begin: inventory
  app.use(StocksV2)         //20191220
  app.use(RequestOrder)     //20200116
  // end: inventory

  // begin : monitoring
  app.use(OSRequest)
  app.use(Approval)
  app.use(Warranty)         // 20220826
  // end : monitoring

  // begin:notification
  app.use(notificationType)        //20200804
  app.use(notificationTimer)       //20200804
  app.use(notificationGroup)       //20200804
  app.use(notificationTemplate)    //20200804
  app.use(notificationProposal)    //20200804
  app.use(notificationLog)         //20200804
  app.use(notificationWA)          //20200804
  // end:notification

  // begin : setting
  app.use(accessGranted)          //20200514
  app.use(nativeQueryStrings)          //20201125
  app.use(PackLov)                // 20201230
  app.use(UtilitiesV2)          // 20220929
  app.use(integrationSystems)
  app.use(globalVariables)      // 20230110
  app.use(AdsBanner)          // 20230228
  app.use(userCredentialsV2) // 20230427
  // end : setting


  // start: finance
  app.use(CashEntryV2)            //20201231
  app.use(CashEntryBalanceV2)            //20210610
  // end: finance

  app.use(LogProcessRequest)
//// v2

  // [NEW]: FERDINAN - 2025-03-06
  app.use(requestStockOutRouter)

  // [MECHANIC TOOLS]: FERDINAN - 2025-05-13
  app.use(mechanicRouter)

  // [MASTER PRODUCT GROUP]: FERDINAN - 16/06/2025
  app.use(stockGroupRouter)
  app.use(stocksGroup)

  // [MPWA CONNECT]: FERDINAN - 31/08/2025
  app.use(mpwaRouter)
}

export default routes
