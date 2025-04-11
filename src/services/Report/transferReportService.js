import dbv from '../../models/view'
import sequelize from '../../native/sequelize'
import stringSQL from '../../native/report/transfer'
import {
  ApiError
} from '../../services/v1/errorHandlingService'
import {
  isEmpty
} from '../../utils/check'

const vw_transfer_in_detail = dbv.vw_transfer_in_detail

const vw_transfer_out_detail = dbv.vw_transfer_out_detail

const reportTrans = [
  'id',
  'storeId',
  'storeName',
  'storeIdSender',
  'storeNameSender',
  'storeName',
  'transNo',
  'transDate',
  'reference',
  'referenceTrans',
  'transType',
  'productId',
  'productCode',
  'productName',
  'qty',
  // 'purchasePrice',
  // 'nettoTotal',
  'status',
  'active',
  'description',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

const reportInTransit = [
  'id',
  'storeId',
  'storeName',
  'storeIdReceiver',
  'storeNameReceiver',
  'reference',
  'storeName',
  'transNo',
  'transDate',
  'transType',
  'productId',
  'productCode',
  'productName',
  'qty',
  'purchasePrice',
  'nettoTotal',
  'status',
  'active',
  'description',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

export function getTransferOut (query, next) {
  let sSQL = stringSQL.s00001
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      replacements: {
        varPeriod: query.period,
        varYear: query.year,
        varStoreId: query.storeId,
        varTransNo: query.transNo ? query.transNo : ''
      },
      type: sequelize.QueryTypes.CALL,
      raw: true
    })
      .then((data) => {
        resolve(JSON.parse(JSON.stringify(data))[0])
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

export function getTransferIn (query) {
  if (query.period && query.year && query.storeId) {
    return vw_transfer_in_detail.findAll({
      attributes: reportTrans,
      where: {
        // transDate: {
        //   $between: [query.from, query.to]
        // },
        storeId: query.storeId,
        status: 1,
        active: 1,
        $and: [
          sequelize.literal(`extract(month from transdate) = ${+query.period}`),
          sequelize.literal(`extract(year from transdate) = ${+query.year}`)
        ]
      },
      order: [
        ['transDate'],
        ['transNo']
      ],
    })
  } else if (query.storeId) {
    return vw_transfer_in_detail.findAll({
      attributes: reportTrans,
      where: {
        storeId: query.storeId
      }
    })
  }
}

export function getTransferInTransit (query) {
  const { period, year, ...other } = query
  if (query.period && query.year) {
    return vw_transfer_out_detail.findAll({
      attributes: reportInTransit,
      where: {
        $and: [
          sequelize.literal(`extract(month from transDate) = ${query.period}`),
          sequelize.literal(`extract(year from transDate) = ${query.year}`)
        ],
        ...other
      }
    })
  } else {
    return vw_transfer_out_detail.findAll({
      attributes: reportInTransit,
      where: {
        ...other
      }
    })
  }
}
