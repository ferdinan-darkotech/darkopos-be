export function countCashback (totalPos, resultLoyalty) {
  if (resultLoyalty.minPayment) {
    if (resultLoyalty && totalPos >= resultLoyalty.minPayment) {
      return Math.floor(totalPos * resultLoyalty.setValue / 100)
    }
  }
  return 0
}

export function reArrangedCashbackIn (gettingData, pos, result, resultLoyalty, createdBy) {
  const dataLoyalty = {
    type: 'I',
    loyaltyId: resultLoyalty.id,
    memberId: pos.memberCode,
    posId: result.dataValues.id,
    minPayment: resultLoyalty.minPayment,
    maxDiscount: resultLoyalty.maxDiscount,
    loyaltySetValue: resultLoyalty.setValue,
    cashbackIn: gettingData,
    cashbackOut: 0,
    createdBy: createdBy
  }
  return dataLoyalty
}

export function reArrangedCashbackOut (gettingData, pos, result, resultLoyalty, createdBy) {
  const dataLoyalty = {
    type: 'O',
    loyaltyId: resultLoyalty.id,
    memberId: pos.memberCode,
    posId: result.dataValues.id,
    minPayment: resultLoyalty.minPayment,
    maxDiscount: resultLoyalty.maxDiscount,
    loyaltySetValue: resultLoyalty.setValue,
    cashbackIn: 0,
    cashbackOut: gettingData,
    createdBy: createdBy
  }
  return dataLoyalty
}