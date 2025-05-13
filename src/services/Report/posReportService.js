/**
 * Created by Veirry on 18/09/2017.
 */
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import stringSQL from '../../native/sqlPosReport'
import { getNativeQuery } from '../../native/nativeUtils'
import dbv from '../../models/view'
import moment from 'moment'
import { Op } from 'sequelize'

const vw_report_pos_trans = dbv.vw_report_pos_trans
const vw_report_pos_trans_cancel = dbv.vw_report_pos_trans_cancel
const vw_member_sales_by_unit_history = dbv.vw_member_sales_by_unit_history
const vw_member_sales_by_unit = dbv.vw_member_sales_by_unit
const vw_member_sales_by_unit_group = dbv.vw_member_sales_by_unit_group
const vw_pos_report_standart = dbv.vw_pos_report_standart

const ReportTransAll = dbv.vw_report_trans_all
const ReportTransAllGroup = dbv.vw_report_trans_all_group
const vw_wo_002 = dbv.vw_wo_002

const reportTrans = ['cashierTransId', 'transNo', 'no_tax_series', 'transDate', 'total', 'discount', 'DPP', 'PPN', 'netto', 'status', 'memo', 'cashier']
const mobileCustomerFields = ['id', 'storeId', 'type', 'serviceType',
  'categoryName', 'usageMileage', 'usageTimePeriod',
  'memberId', 'memberCode', 'memberName', 'policeNo', 'policeNoId',
  'transNo', 'transDate', 'productId', 'productCode', 'productName', 'qty', 'sellingPrice', 'total', 'totalDiscount', 'nettoTotal']

const stringCountBetween = (column, hour, to) => `count(if_ist(${column} = '${hour}', 1, null))`

const hourlyField = (transTime) => {
  return [
    'transDate',
    'transTime',
    [sequelize.literal(`count(if_ist(transTime between '${transTime.transTime1}' and '${transTime.transTime2}', 1, null))`), 'count1'],
    [sequelize.literal(`count(if_ist(transTime between '${transTime.transTime3}' and '${transTime.transTime4}', 1, null))`), 'count2'],
    [sequelize.literal(`count(if_ist(transTime between '${transTime.transTime5}' and '${transTime.transTime6}', 1, null))`), 'count3'],
    [sequelize.literal(`count(if_ist(transTime between '${transTime.transTime7}' and '${transTime.transTime8}', 1, null))`), 'count4'],
  ]
}
const hourField = (transTime) => {
  let array = [
    'transDate',
    'transTime',
  ]
  for (let n = 0; n < 24; n += 1) {
    array.push([sequelize.literal(stringCountBetween('extract(hour from transTime)', n + 1)), `count${n + 1}`])
  }
  return array
}
const hourInterval = () => {
  let array = [
    [sequelize.literal('coalesce(timeIn, transDate)'), 'transDateIn'],
    'transDate',
    'transTime',
  ]
  for (let n = 0; n < 24; n += 1) {
    array.push([sequelize.literal(stringCountBetween(`extract(hour from COALESCE(timeIn, CONCAT(transDate, ' ', transTime))) + 1`, n + 1)), `countIn${n + 1}`])
  }
  for (let m = 0; m < 24; m += 1) {
    array.push([sequelize.literal(stringCountBetween(`extract(hour from CONCAT(transDate, ' ', transTime)) + 1`, m + 1)), `count${m + 1}`])
  }
  return array
}

const mbrFields01 = [
  'id',
  'storeId',
  'memberId',
  'memberCode',
  'memberName',
  'policeNo',
  'policeNoId',
  'grandTotal',
  'totalDiscount',
  'nettoTotal'
]

export function getReportPosTrans (query) {
  const { from, to, storeId, ...other } = query
  if (query.from && query.storeId) {
    return vw_report_pos_trans.findAll({
      attributes: reportTrans,
      where: {
        transDate: {
          [Op.and]: {
            [Op.gte]: query.from,
            [Op.lte]: query.to
          }
        },
        storeId: query.storeId,
        status: 'A',
        ...other
      },
      // where: {
      //   transDate: {
      //     [Op.between]: [query.from, query.to]
      //   },
      //   storeId: query.storeId,
      //   [Op.and]: {
      //     status: 'A'
      //   }
      // },
      order: ['transdate', 'transno'],
    })
  } else if (query.storeId) {
    return vw_report_pos_trans.findAll({
      attributes: reportTrans,
      where: {
        storeId: query.storeId,
        ...other
      }
    })
  } else {
    return vw_report_pos_trans.findAll({
      attributes: reportTrans,
    })
  }
}

const fieldReportTransAll = [
  'storeId',
  'storeCode',
  'storeName',
  'cashierTransId',
  'transNo',
  'transDate',
  'woReference',
  ['sum(qtyProduct)', 'qtyProduct'],
  ['sum(qtyService)', 'qtyService'],
  ['sum(product)', 'product'],
  ['sum(service)', 'service'],
  ['sum(discount)', 'discount'],
  ['sum(dpp)', 'dpp'],
  'status',
  'memberName',
  'policeNo'
]

const fieldReportTransAllGroup = [
  'storeId',
  'storeCode',
  'storeName',
  'cashierTransId',
  'transNo',
  'transDate',
  'woReference',
  ['qtyProduct', 'qtyProduct'],
  ['qtyService', 'qtyService'],
  [sequelize.literal(`SUM(if_ist(qtyService <> 0, 1, 0))`), 'qtyUnit'],
  [sequelize.literal('SUM(if_nst(qtyService = 0, product, 0.0))'), 'counter'],
  [sequelize.literal('SUM(if_nst(qtyService > 0, product, 0.0))'), 'product'],
  ['sum(service)', 'service'],
  ['sum(discount)', 'discount'],
  ['sum(dpp)', 'dpp'],
  'status',
  'memberName',
  'policeNo'
]

export function getReportTransAll (query) {
  const { from, to, storeId, cashierTransId } = query
  
  const newFromDate = moment(from).format('YYYY-MM-DD')
  const newToDate = moment(to).format('YYYY-MM-DD')

  const reportTransAll = `
    select
      transno as "transNo",
      storecode as "storeCode",
      storename as "storeName",
      transdate as "transDate",
      membername as "memberName",
      policeno as "policeNo",
      qtyproduct as "qtyProduct",
      qtyservice as "qtyService",
      nettproduct as "product",
      nettservice as "service"
    from sch_pos.fn_sales_by_service_product_per_invoice(${storeId}, '${newFromDate}', '${newToDate}', ${cashierTransId || null}) value
  `
  return getNativeQuery(reportTransAll, false, 'CALL')

  // return ReportTransAll.findAll({
  //   attributes: fieldReportTransAll,
  //   where: {
  //     ...(cashierTransId ? { cashierTransId } : {}),
  //     transDate: {
  //       [Op.between]: [from, to]
  //     },
  //     storeId
  //   },
  //   group: ['transNo', 'storeId','storeCode','storeName','cashierTransId','transDate','woReference',
  //   'status','memberName','policeNo'],
  //   order: [
  //     ['transDate', 'ASC'],
  //     ['transNo', 'ASC']
  //   ],
  // })
}

export function getReportTransAllGroup (query) {
  const { from, to, storeId, cashierTransId, typeGroup='pands' } = query
  
  const newFromDate = moment(from).format('YYYY-MM-DD')
  const newToDate = moment(to).format('YYYY-MM-DD')

  const reportTransAllGroup = `
    select
      transdate as "transDate",
      qtyproduct as "qtyProduct",
      qtyservice as "qtyService",
      nettproduct as "product",
      nettservice as "service",
      nettcounter as "counter",
      ttlunit as "qtyUnit"
    from sch_pos.fn_sales_by_date_unit(${storeId}, '${newFromDate}', '${newToDate}', ${cashierTransId || null}) value
  `
  return getNativeQuery(reportTransAllGroup, false, 'CALL').then(result => {
    let rs = JSON.parse(JSON.stringify(result))[0]
    if(typeGroup === 'pands') {
      let tmpData = []
      let dateExists = []
      rs.map(x => {
        const indexing = dateExists.indexOf(x.transDate)
        if(indexing === -1) {
          tmpData.push({ ...x, qtyUnit: +x.qtyUnit, transDate: x.transDate })
          dateExists.push(x.transDate)
        } else {
          tmpData[indexing].qtyUnit += +x.qtyUnit
          tmpData[indexing].counter += x.counter
          tmpData[indexing].product += x.product
          tmpData[indexing].service += x.service
          tmpData[indexing].discount += (x.discount || 0)
          tmpData[indexing].dpp += (x.dpp || 0)
        }
      })
      return { success: true, data: tmpData }
    } else {
      return { success: true, data: rs }
    }
  }).catch(er => ({ success: false, message: rs.message }))
}

export function getReportTransRealization(query) {
  const { from, to, storeId, typeGroup = 'pands' } = query;

  const newFromDate = moment(from).format('YYYY-MM');
  const newToDate = moment(to).format('YYYY-MM');

  const storeIdSplit = `'{${storeId.join(',')}}'`;

  const reportTransAllGroup = `
    SELECT
      storeid as "storeId",
      transdate as "transDate",
      store_code as "storeCode",
      store_name as "storeName",
      dppservice as "dppService",
      dppproduct as "dppProduct",
      qtyproduct as "qtyProduct",
      qtyservice as "qtyService",
      nettproduct as "product",
      nettservice as "service",
      nettcounter as "counter",
      ttlunit as "qtyUnit",
      invoicecount as "invoiceCount",
      unitcount as "unitCount"
    FROM sch_pos.fn_realisasi_by_month_outlet(${storeIdSplit}, '${newFromDate}', '${newToDate}') value
  `;

  return getNativeQuery(reportTransAllGroup, false, 'CALL').then(result => {
    let rs = JSON.parse(JSON.stringify(result))[0];
    if (typeGroup === 'pands') {
      return { success: true, data: rs };
    } else {
      return { success: true, data: rs };
    }
  }).catch(er => ({ success: false, message: er.message }));
}

export function getReportPowerBISales(query) {
  const { from, to, storeId, typeGroup = 'pands' } = query;

  const newFromDate = moment(from).format('YYYY-MM');
  const newToDate = moment(to).format('YYYY-MM');

  const storeIdSplit = `'${storeId.join(',')}'`;

  const reportTransAllGroup = `
    SELECT
      storeid as "storeId",
      store_code as "storeCode",
      store_name as "storeName",
      month as "transDate",
      targetproducts as "targetProducts",
      targetunits as "targetUnits",
      targetservices as "targetServices",
      dppservice as "dppService",
      dppproduct as "dppProduct",
      invoicecount as "invoiceCount",
      unitcount as "unitCount"
    FROM sch_pos.fn_get_powerbi_sales(${storeIdSplit}, '${newFromDate}', '${newToDate}')
    ORDER BY to_date(month, 'Mon YYYY') ASC
  `;

  return getNativeQuery(reportTransAllGroup, false, 'CALL').then(result => {
    let rs = JSON.parse(JSON.stringify(result))[0];
    if (typeGroup === 'pands') {
      return { success: true, data: rs };
    } else {
      return { success: true, data: rs };
    }
  }).catch(er => ({ success: false, message: er.message }));
}

export async function getReportPowerBIData(query) {
  try {
    const [trmResult, ssrResult] = await Promise.all([
      getReportPowerBIDataTRM(query),
      getReportPowerBIDataSSR(query)
    ]);

    if (trmResult.success && ssrResult.success) {
      const trmData = trmResult.data;
      const ssrData = ssrResult.data;

      const mergedData = trmData.map(trmItem => {
        const matchingSsrItem = ssrData.find(
          ssrItem =>
            ssrItem.storename === trmItem.storeName &&
            ssrItem.categorycode === trmItem.categoryCode &&
            ssrItem.brandcode === trmItem.brandCode
        );

        if (matchingSsrItem) {
          return {
            ...trmItem,
            periode: matchingSsrItem.periode,
            cogs: matchingSsrItem.cogs,
            grossprof: matchingSsrItem.grossprof,
            gpm: matchingSsrItem.gpm
          };
        }

        return trmItem;
      });

      return { success: true, data: mergedData };
    } else {
      return { success: false, message: 'Failed to fetch TRM or SSR data' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getReportPowerBIDataTRM(query) {
  const { storeId, periode, mtd, compare, avgsales, typeGroup = 'pands' } = query;
  const formatPeriode = moment(periode).format('YYYY-MM-DD');
  const formatMtdDate = moment(mtd).format('YYYY-MM-DD');
  const formatCompare = moment(compare).format('YYYY-MM-01');

  const reportPromises = storeId.map(async (id) => {
    const reportTRM = `
      SELECT
        storename as "storeName",
        categorycode as "categoryCode",
        categoryname as "categoryName",
        brandcode as "brandCode",
        brandname as "brandName",
        compare_realizationqty as "compareQty",
        compare_realizationamount as "compareNominal",
        targetqty as "targetQty",
        targetamount as "targetNominal",
        realizationqty as "realisasiQty",
        realizationamount as "realisasiNominal",
        ondateqty as "stockQty",
        ondateamount as "stockNominal",
        avgsales as "avgSales",
        stocklevel as "stockLevel"
      FROM sch_pos.fn_get_powerbi_data_trm('${id}', '${formatPeriode}', '${formatMtdDate}', '${formatCompare}', ${avgsales}) value
    `;

    return getNativeQuery(reportTRM, false, 'CALL').then(result => {
      return JSON.parse(JSON.stringify(result))[0];
    });
  });

  try {
    const results = await Promise.all(reportPromises);
    const rs = results.flat();
    if (typeGroup === 'pands') {
      return { success: true, data: rs };
    } else {
      return { success: true, data: rs };
    }
  } catch (er) {
    return { success: false, message: er.message };
  }
}

export function getReportPowerBIDataSSR(query) {
  const { periode, listStore, typeGroup = 'pands' } = query;

  const newFromDate = moment(periode).format('YYYY-MM-01');
  const newToDate = moment(periode).endOf('month').format('YYYY-MM-DD');

  const storeCodeSplit = `'${listStore.join(',')}'`;

  const reportSSR = `
    SELECT
      storecode,
      storename,
      periode,
      categorycode,
      categoryname,
      brandcode,
      brandname,
      salesamount,
      qty,
      cogs,
      grossprof,
      gpm
    FROM sch_pos.fn_get_powerbi_data_ssr_02(${storeCodeSplit}, '${newFromDate}', '${newToDate}') value
  `;

  return getNativeQuery(reportSSR, false, 'CALL').then(result => {
    let rs = JSON.parse(JSON.stringify(result))[0];
    if (typeGroup === 'pands') {
      return { success: true, data: rs };
    } else {
      return { success: true, data: rs };
    }
  }).catch(er => ({ success: false, message: er.message }));
}

export function getReportPosTransCancel (query) {
  const { from, to, storeId, ...other } = query
  if (query.from) {
    return vw_report_pos_trans_cancel.findAll({
      attributes: reportTrans,
      where: {
        transDate: {
          [Op.between]: [query.from, query.to]
        },
        storeId: query.storeId,
        status: 'C',
        ...other
      },
      order: [
        ['transDate'],['transNo'] 
      ],
    })
  } else {
    return vw_report_pos_trans_cancel.findAll({
      attributes: reportTrans,
      where: {
        storeId: query.storeId,
      }
    })
  }
}

export function getReportPosTransMemberHistory (query) {
  const { from, to, mode, ...other } = query
  if (mode === 'detail') {
    if (query && !from && !to) {
      return vw_member_sales_by_unit_history.findAll({
        attributes: mobileCustomerFields,
        where: {
          ...other
        },
        order: [
          ['transDate']
        ],
      })
    } else if (from && to) {
      return vw_member_sales_by_unit_history.findAll({
        attributes: mobileCustomerFields,
        where: {
          transDate: {
            [Op.between]: [from, to]
          },
          ...other
        },
        order: [
          ['transDate']
        ],
      })
    }
  } else {
    if (query && !from && !to) {
      return vw_member_sales_by_unit.findAll({
        // attributes: reportTrans,
        where: {
          ...other
        },
        order: [
          ['transDate']
        ],
      })
    } else if (from && to) {
      return vw_member_sales_by_unit.findAll({
        where: {
          transDate: {
            [Op.between]: [from, to]
          },
          ...other
        },
        order: [
          ['transDate']
        ],
      })
    }
  }
}

export function getReportHourlyCustomer (queryBetween, other, next) {
  let { type, transDate, transTime } = queryBetween
  if (transDate) {
    transDate = {
      [Op.between]: [transDate.from, transDate.to]
    }
  }
  if (type === 'all' && other && transDate) {
    return vw_pos_report_standart.findAll({
      attributes: hourlyField(transTime),
      where: {
        transDate,
        status: 'A',
        ...other
      },
      group: ['transDate', 'storeId', 'transtime'],
    })
  } else {
    return vw_pos_report_standart.findAll({
      attributes: hourlyField(transTime),
      where: {
        transDate,
        status: 'A',
        ...other
      },
      group: ['transDate', 'storeId', 'transtime'],
    })
  }
}

export function getReportHourCustomer (queryBetween, other, next) {
  let { type, transDate, transTime } = queryBetween
  if (transDate) {
    transDate = {
      [Op.between]: [transDate.from, transDate.to]
    }
  }
  if (other && transDate) {
    return vw_pos_report_standart.findAll({
      attributes: hourField(transTime),
      where: {
        transDate,
        status: 'A',
        ...other
      },
      group: ['transDate', 'storeId', 'transtime'],
    })
  }
}

export function getReportHourInterval (queryBetween, other, next) {
  let { type, transDate, transTime } = queryBetween
  if (transDate) {
    transDate = {
      [Op.between]: [transDate.from, transDate.to]
    }
  }
  if (other && transDate) {
    return vw_wo_002.findAll({
      attributes: hourInterval(),
      where: {
        transDate,
        ...other
      },
      group: [sequelize.literal('date(timeIn)'), 'transDate', 'storeId'],
      order: [
        [sequelize.literal('date(timeIn)')],
        ['transDate']
      ]
    })
  }
}

export function countData (query) {
  // return vwMember.findAll({
  //   attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']]
  // })
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else {
      query[key] = { [Op.iRegexp]: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in mbrFields01) {
      const id = Object.assign(mbrFields01)[key]
      if (id === 'memberCode') {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vw_member_sales_by_unit_group.count({
      where: {
        [Op.or]: querying
      },
    })
  } else {
    return vw_member_sales_by_unit_group.count({
      where: {
        ...query
      }
    })
  }
}

export function getMemberAssetsReport (query) {
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in mbrFields01) {
      const id = Object.assign(mbrFields01)[key]
      if ((id === 'memberCode')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vw_member_sales_by_unit_group.findAll({
      attributes: mbrFields01,
      where: {
        [Op.or]: querying
      },
    })
  } else {
    return vw_member_sales_by_unit_group.findAll({
      attributes: mbrFields01,
      where: {
        ...query
      },
    })
  }
}

export function getDailyPos (query) {
  let sSQL
  switch (query.mode) {
    case 'p': sSQL = stringSQL.s00001; break         //product
    case 'b': sSQL = stringSQL.s00002; break         //brand
    case 'c': sSQL = stringSQL.s00003; break         //category
    case 'pbc': sSQL = stringSQL.s00004; break       //product-brand-category
    default: sSQL = stringSQL.s00001; break          //product
  }

  sSQL = sSQL.replace("_BIND01", query.from).replace("_BIND02", query.to)
  if (query.category && query.brand) {
    sSQL = sSQL.replace("_WHERECONDITION",
      query.category ? " AND b.categoryName='" + query.category + "'" +
        " AND brandName='" + query.brand + "'" +
        " AND storeId='" + query.storeId + "'" : "")
  } else {
    if (query.category) {
      sSQL = sSQL.replace("_WHERECONDITION",
        query.category ? " AND b.categoryName='" + query.category + "'" +
          " AND storeId='" + query.storeId + "'" : "")
    }
    if (query.brand) {
      sSQL = sSQL.replace("_WHERECONDITION",
        query.brand ? " AND brandName='" + query.brand + "'" +
          " AND storeId='" + query.storeId + "'" : "")
    }
    if (!(query.brand && query.category)) {
      sSQL = sSQL.replace("_WHERECONDITION",
        query.storeId ?
          " AND storeId='" + query.storeId + "'" : "")
    }
  }
  if (query.cashierTransId) {
    sSQL = sSQL.replace("_CASHIER",
      query.cashierTransId ? " AND a.cashierTransId='" + query.cashierTransId + "'" : "")
  } else {
    sSQL = sSQL.replace("_CASHIER", '')
  }

  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, { type: sequelize.QueryTypes.SELECT })
      .then(users => {
        resolve(users)
      })
  })
}

export function getDetailPos (query) {
  let sSQL = stringSQL.s00005

  sSQL = sSQL.replace("_BIND01", query.from).replace("_BIND02", query.to)
  if (query.transNo || query.storeId || query.status) {
    sSQL = sSQL.replace("_WHERECONDITION",
      `${query.transNo ? " AND transNo='" + query.transNo + "'" : ""}` +
      `${query.storeId ? " AND storeId='" + query.storeId + "'" : ""}` +
      `${query.status ? " AND status='" + query.status + "'" : ""}` +
      `${query.cashierTransId ? " AND cashierTransId='" + query.cashierTransId + "'" : ""}`
    )
  } else {
    sSQL = sSQL.replace("_WHERECONDITION", "")
  }

  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, { type: sequelize.QueryTypes.SELECT })
      .then(users => {
        resolve(users)
      })
  })
}

export function getTurnOver (query, next) {
  let sSQL = stringSQL.s00006
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      replacements: {
        varPeriod: query.period,
        varYear: query.year,
        varStoreId: query.storeId,
        varCategory: query.category || null,
        varService: query.service || null
      },
      type: sequelize.QueryTypes.CALL
    }).then((data) => {
      resolve(data)
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const {
        parent,
        original,
        sql,
        ...other
      } = errObj
      next(new ApiError(501, other, err))
    })
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const {
      parent,
      original,
      sql,
      ...other
    } = errObj
    next(new ApiError(400, other, err))
  })
}

export function getTurnOverNext (query, next) {
  let sSQL = stringSQL.s00006
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      replacements: {
        varPeriod: query.periodNext,
        varYear: query.yearNext,
        varStoreId: query.storeId,
        varCategory: query.category || null,
        varService: query.service || null
      },
      type: sequelize.QueryTypes.CALL
    }).then((data) => {
      resolve(data)
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const {
        parent,
        original,
        sql,
        ...other
      } = errObj
      next(new ApiError(501, other, err))
    })
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const {
      parent,
      original,
      sql,
      ...other
    } = errObj
    next(new ApiError(400, other, err))
  })
}

export function srvCompareSalesVsInventory (query) {
  let sSQL = stringSQL.s00007
  sSQL = sSQL
    .replace(":varPeriod", Number(query.period))
    .replace(":varYear", query.year)
    .replace(":varDate1", '\'' + query.from + '\'')
    .replace(":varDate2", '\'' + query.to + '\'')
    .replace(":varCategoryId", query.category)
    .replace(":varBrandId", '\'' + query.brand.replace('[', '').replace(']', '') + '\'')
    .replace(":varStoreId", query.storeId)
  return getNativeQuery(sSQL, false, 'RAW')
}
