import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getData, countData, getDataBrand, countDataBrand, getReportSalesRunningTotal, getReportSalesCostTotal, getReportBeginBalanceTotal,
  getReportBeginTotal, getReportVwQtyIn, createDummyBeginBalanceTotal,
  getReportRealBeginBalanceTotal,
  getGroupByParams
} from '../../services/Report/marketingReportService'
import {
  getDataTarget
} from '../../services/marketing/targetService'

// Retrieve list
exports.getData = async function (req, res, next) {
  console.log('Requesting-getDataMarketingTarget: ' + req.url + ' ...')
  let { pageSize, page, storeId, year, to, from, byCategory, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }

  try {
    await createDummyBeginBalanceTotal()

    const costDataFrom = await getReportSalesCostTotal(storeId, year, from)
    const costDataTo = await getReportSalesCostTotal(storeId, year, to)
    const targetData = await getDataTarget({ year, storeId })
    const newTargetData = targetData.map(x => ({ ...x.dataValues }))

    // Brand && Category
    const tempBegin = await getReportBeginBalanceTotal(byCategory)
    const realBegin = await getReportRealBeginBalanceTotal(storeId, year, to, byCategory)
    const reportData = await getReportSalesRunningTotal(storeId, year, to, byCategory)
    const BeginTotal = await getReportBeginTotal(storeId, year, byCategory)
    const VwQtyIn = await getReportVwQtyIn(storeId, year, from, byCategory)

    let count, data

    if (Number(byCategory)) {
      count = await countData(other)
      data = await getData(other, pagination)
    } else {
      count = await countDataBrand(other)
      data = await getDataBrand(other, pagination)
    }

    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pageSize || 10,
      page: page || 1,
      total: count,
      data: data.map(x => ({
        ...x,
        beginTotal: BeginTotal.filter(beginItem => beginItem[getGroupByParams(byCategory)] === x.id),
        vwQtyIn: VwQtyIn.filter(beginItem => beginItem[getGroupByParams(byCategory)] === x.id),
        tempBegin: tempBegin.filter(beginItem => beginItem[getGroupByParams(byCategory)] === x.id),
        realBegin: realBegin.filter(beginItem => beginItem[getGroupByParams(byCategory)] === x.id),
        target: newTargetData[0] ? newTargetData[0][Number(byCategory) ? 'category' : 'brand'].filter(reportItem => reportItem[getGroupByParams(byCategory)] === x.id) : [],
        report: reportData.filter(reportItem => reportItem[getGroupByParams(byCategory)] === x.id),
        costFrom: costDataFrom.filter(costItem => costItem[getGroupByParams(byCategory)] === x.id),
        costTo: costDataTo.filter(costItem => costItem[getGroupByParams(byCategory)] === x.id)
      }))
    })
  } catch (err) {
    next(new ApiError(501, err + ` - 01. Couldn't find Report.`, err))
  }
}
