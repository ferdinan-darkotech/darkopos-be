import { getTotalPos, reArrangedBundling, reArrangedPosDetail } from '../posdetail'

const storeId = 1

const posDetail = [
  {
    no: 1,
    bundleId: 1,
    employeeId: 1,
    productId: 1,
    productCode: 'test1',
    qty: 1,
    sellingPrice: 20000,
    DPP: 18000,
    PPN: 0,
    typeCode: 'P',
    discountLoyalty: 0,
    discount: 0,
    disc1: 10,
    disc2: 0,
    disc3: 0,
  },
  {
    no: 2,
    bundleId: 1,
    bundleId: 1,
    employeeId: 1,
    productId: 1,
    productCode: 'test1',
    qty: 2,
    sellingPrice: 15000,
    DPP: 30000,
    PPN: 0,
    typeCode: 'S',
    discountLoyalty: 0,
    discount: 0,
    disc1: 0,
    disc2: 0,
    disc3: 0,
  }
]

const result = { // header result
  dataValues: {
    id: 1
  }
}

it('Should return 48000', async () => {
  const gettingData = await getTotalPos(posDetail)
  expect(gettingData).toEqual(48000)
})

it('Should return object of pos bundling', async () => {
  const gettingData = await reArrangedBundling(posDetail, result, '000001')

  expect(gettingData).toEqual(posDetail.map((x) => ({
    sort: x.no,
    posId: result.dataValues.id,
    bundlingId: x.bundleId,
    qty: x.qty,
    createdBy: '000001',
    updatedBy: '---'
  })))
})

it('Should return empty array of pos bundling', async () => {
  const gettingData = await reArrangedBundling(null, result, '000001')

  expect(gettingData).toEqual([])
})

it('Should return object of Pos Detail', async () => {
  const gettingData = await reArrangedPosDetail('FJ/0101/2000', { storeId }, posDetail, '000001')

  expect(gettingData).toEqual(posDetail.map((dataPosDetail) => {
    const { no, bundleId, ...other } = dataPosDetail
    return ({
      storeId,
      transNo: 'FJ/0101/2000',
      bundlingId: dataPosDetail.bundleId,
      ...other,
      createdBy: '000001',
      updatedBy: '---'
    })
  }))
})

it('Should return empty array of Pos Detail', async () => {
  const gettingData = await reArrangedPosDetail('FJ/0101/2000', { storeId }, null, '000001')

  expect(gettingData).toEqual([])
})
