import { rearrangeTransferOutHpokokHppPrice } from '../transfer/transferOut'
import { insertData } from '../sequencesService';
const data = []
const sequence = 'MUOUT2019000001'
const storeId = 1
const createdBy = '000001'

it('Mutasi Out Rearrange Should return 0', async () => {
  const arrayProd = [
    {
      no: 1,
      qty: 14,
      description: null,
      transType: 'MUOUT',
      productId: 1208
    },
    {
      no: 1,
      qty: 20,
      description: null,
      transType: 'MUOUT',
      productId: 1209
    }
  ]
  const resultDetail = [
    {
      id: 1,
      transNoId: 1492,
      storeId: 1,
      transNo: 'ITC-125687',
      transDate: '2019-01-05 08:49:08',
      productId: 1208,
      qty: 6,
      purchasePrice: 134750
    },
    {
      id: 2,
      transNoId: 1493,
      storeId: 1,
      transNo: 'ITC-125686',
      transDate: '2019-01-05 08:50:06',
      productId: 1208,
      qty: 8,
      purchasePrice: 134750
    },
    {
      id: 3,
      transNoId: 1493,
      storeId: 1,
      transNo: 'ITC-125687',
      transDate: '2019-01-05 08:50:06',
      productId: 1208,
      qty: 8,
      purchasePrice: 134750
    },
    {
      id: 4,
      transNoId: 2122,
      storeId: 1,
      transNo: 'ITC-125686',
      transDate: '2019-01-05 08:50:06',
      productId: 1209,
      qty: 30,
      purchasePrice: 134750
    }
  ]
  const insertedData = await rearrangeTransferOutHpokokHppPrice(data, sequence, storeId, arrayProd, resultDetail, createdBy)
  const requestQty = arrayProd.reduce((prev, next) => prev + next.qty, 0)
  const insertedDataTotalQty = insertedData.data.reduce((prev, next) => prev + next.qty, 0)
  expect(requestQty - insertedDataTotalQty).toEqual(0)
})

it('Transfer Out hpokok should split', async () => {
  const arrayProd = [
    {
      no: 1,
      qty: 8,
      description: null,
      transType: 'MUOUT',
      productId: 1208
    }
  ]
  const resultDetail = [
    {
      id: 1,
      transNoId: 1492,
      storeId: 1,
      transNo: 'ITC-125687',
      transDate: '2019-01-05 08:49:08',
      productId: 1208,
      qty: 6,
      purchasePrice: 134750
    },
    {
      id: 3,
      transNoId: 1493,
      storeId: 1,
      transNo: 'ITC-125687',
      transDate: '2019-01-05 08:50:06',
      productId: 1208,
      qty: 8,
      purchasePrice: 134750
    }
  ]

  const expectedResult = [{
    storeId: 1,
    purchaseId: 1492,
    storeIdReceiver: undefined,
    transNo: 'MUOUT2019000001',
    transType: 'MUOUT',
    productId: 1208,
    qty: 6,
    purchasePrice: 134750,
    createdBy: '000001',
    updatedBy: '---'
  },
  {
    storeId: 1,
    purchaseId: 1493,
    storeIdReceiver: undefined,
    transNo: 'MUOUT2019000001',
    transType: 'MUOUT',
    productId: 1208,
    qty: 2,
    purchasePrice: 134750,
    createdBy: '000001',
    updatedBy: '---'
  }]

  const insertedData = await rearrangeTransferOutHpokokHppPrice(data, sequence, storeId, arrayProd, resultDetail, createdBy)
  expect(insertedData.data).toEqual(expectedResult)
})

it('Should return false because qty not available', async () => {
  const arrayProd = [
    {
      no: 1,
      qty: 15,
      description: null,
      transType: 'MUOUT',
      productId: 1208
    },
    {
      no: 1,
      qty: 20,
      description: null,
      transType: 'MUOUT',
      productId: 1209
    }
  ]
  const resultDetail = [
    {
      id: 1,
      transNoId: 1492,
      storeId: 1,
      transNo: 'ITC-125687',
      transDate: '2019-01-05 08:49:08',
      productId: 1208,
      qty: 6,
      purchasePrice: 134750
    },
    {
      id: 2,
      transNoId: 1493,
      storeId: 1,
      transNo: 'ITC-125686',
      transDate: '2019-01-05 08:50:06',
      productId: 1208,
      qty: 8,
      purchasePrice: 134750
    },
    {
      id: 3,
      transNoId: 2122,
      storeId: 1,
      transNo: 'ITC-125686',
      transDate: '2019-01-05 08:50:06',
      productId: 1209,
      qty: 20,
      purchasePrice: 134750
    }
  ]
  const insertedData = await rearrangeTransferOutHpokokHppPrice(data, sequence, storeId, arrayProd, resultDetail, createdBy)
  expect(insertedData.success).toEqual(false)
})