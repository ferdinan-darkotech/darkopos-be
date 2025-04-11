import moment from "moment"

export function rearrangeTransferOutHpokokHppPrice (data, sequence, storeId, arrayProd, resultDetail, createdBy) {
  let arrayHppPrice = []
  for (let x = 0; x < arrayProd.length; x += 1) {
    const availableQty = resultDetail.filter(detail => detail.productId === arrayProd[x].productId)
    let availableQtyTotal = availableQty.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    if (availableQtyTotal > 0 && (availableQtyTotal - arrayProd[x].qty) >= 0) {
      let requiredQty = arrayProd[x].qty
      for (let n = 0; n < availableQty.length; n += 1) {
        if (requiredQty > 0) {
          arrayHppPrice.push({
            storeId,
            purchaseId: availableQty[n].transNoId,
            storeIdReceiver: data.storeIdReceiver,
            transNo: sequence,
            transType: arrayProd[x].transType,
            productId: arrayProd[x].productId,
            qty: availableQty[n].qty - requiredQty <= 0 ? availableQty[n].qty : requiredQty,
            purchasePrice: availableQty[n].purchasePrice,
            createdBy,
            createdAt: moment(),
            updatedBy: '---'
          })
          requiredQty -= (availableQty[n].qty - requiredQty <= 0 ? availableQty[n].qty : requiredQty)
        }
      }
    } else {
      return {
        data: [],
        success: false
      }
    }
  }
  return ({
    data: arrayHppPrice,
    success: true
  })
}