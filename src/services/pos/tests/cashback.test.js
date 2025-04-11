import { countCashback, reArrangedCashbackIn, reArrangedCashbackOut } from '../cashback'

const resultLoyalty = {
  id: 1,
  setValue: 2,
  minPayment: 50000,
  maxDiscount: 50000,
}

const pos = {
  memberCode: 1
}

const result = { // header result
  dataValues: {
    id: 1
  }
}

it('Should return 1000', async () => {
  const gettingData = await countCashback(50000, resultLoyalty)
  expect(gettingData).toEqual(1000)
})

it('Should return 0', async () => {
  const gettingData = await countCashback(49999, resultLoyalty)
  expect(gettingData).toEqual(0)
})

it('Should return 1000 withot decimal', async () => {
  const gettingData = await countCashback(50001, resultLoyalty)
  expect(gettingData).toEqual(1000)
})

it('Should return 1000 withot decimal', async () => {
  const gettingData = await countCashback(100000, resultLoyalty)
  expect(gettingData).toEqual(2000)
})

it('Should return 0 because no resultLoyalty', async () => {
  const gettingData = await countCashback(100000, {})
  expect(gettingData).toEqual(0)
})

it('Should return object of member cashback out', async () => {
  const resultFunction = await reArrangedCashbackIn(1000, pos, result, resultLoyalty, '000001')
  expect(resultFunction).toEqual({
    type: 'I',
    loyaltyId: resultLoyalty.id,
    memberId: pos.memberCode,
    posId: result.dataValues.id,
    minPayment: resultLoyalty.minPayment,
    maxDiscount: resultLoyalty.maxDiscount,
    loyaltySetValue: resultLoyalty.setValue,
    cashbackIn: 1000,
    cashbackOut: 0,
    createdBy: '000001'
  })
})

it('Should return object of member cashback in', async () => {
  const resultFunction = await reArrangedCashbackOut(1000, pos, result, resultLoyalty, '000001')
  expect(resultFunction).toEqual({
    type: 'O',
    loyaltyId: resultLoyalty.id,
    memberId: pos.memberCode,
    posId: result.dataValues.id,
    minPayment: resultLoyalty.minPayment,
    maxDiscount: resultLoyalty.maxDiscount,
    loyaltySetValue: resultLoyalty.setValue,
    cashbackIn: 0,
    cashbackOut: 1000,
    createdBy: '000001'
  })
})
