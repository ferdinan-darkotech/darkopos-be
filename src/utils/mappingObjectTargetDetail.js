import moment from 'moment'

export default function mappingObjectTargetDetail(_data) {
  let existCategory = []
  let existRange = []
  let storage = {}
  const data = JSON.parse(JSON.stringify(_data))
  for (let x in data) {
    const {
      id, referenceId, storeName, storeCode, categoryCode, categoryName, brandCode, brandName, brandname,
      startDate, endDate, targetSalesQty, targetSalesValue
    } = data[x]
    const tmpStartDate = moment(startDate).format('YYYY-MM')
    const tmpEndDate = moment(endDate).format('YYYY-MM')
    const date = [tmpStartDate, tmpEndDate]
    let indexDate = existRange.indexOf(date.join('~'))
    if(x * 1 === 0) {
      existRange.push(date.join('~'))
      const data = [ { rangeTarget: date, detail: [] } ]
      storage = { storeCode, storeName, data }
      indexDate = storage.data.length - 1
    } else if ((indexDate === -1)) {
      existRange.push(date.join('~'))
      existCategory = []
      storage.data.push({ rangeTarget: date, detail: [] })
      indexDate = storage.data.length - 1
    }
    const items = {
      id,
      brandCode,
      brandName: brandName || brandname,
      targetSalesQty,
      targetSalesValue
    }

    const index = existCategory.indexOf(categoryCode)
    if( index === -1) {
      existCategory.push(categoryCode)
      storage.data[indexDate].detail.push({
        categoryCode, categoryName, items: [items]
      })
    } else {
      storage.data[indexDate].detail[index].items.push(items)
    }
  }
  return storage
}