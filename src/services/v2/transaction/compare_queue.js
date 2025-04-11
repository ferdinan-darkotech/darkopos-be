const oldValue = {
  "discountLoyalty": 0,
  "cashier_trans": [
    {
      "productcode": "TTPPTLHIJ",
      "productname": "TUTUP PENTIL NITROGEN HIJAU",
      "brandname": "TDF",
      "qtyonhand": 732,
      "costprice": 55000,
      "sellprice": 70000,
      "employee": "000005",
      "distprice01": 65000,
      "distprice02": 60000,
      "max_disc": 100,
      "qty": 1,
      "disc1": 0,
      "disc2": 0,
      "disc3": 0,
      "discount": 0,
      "price": 65000,
      "discountLoyalty": 0,
      "typeCode": "P",
      "sellingPrice": 65000,
      "vouchercode": null,
      "bundleId": null,
      "vouchertype": null,
      "total": 65000
    }
  ],
  "service_detail": [],
  "bundle": [],
  "member": "BKS001002156",
  "woNumber": null,
  "wo": 1,
  "unit": "BK2031ER",
  "employee": "000005",
  "voucherPayment": []
}

const newValue = {
  "discountLoyalty": 0,
  "cashier_trans": [
    {
      "productcode": "TTPPTLHIJ",
      "productname": "TUTUP PENTIL NITROGEN HIJAU",
      "brandname": "TDF",
      "qtyonhand": 732,
      "costprice": 55000,
      "sellprice": 70000,
      "employee": "000005",
      "distprice01": 65000,
      "distprice02": 60000,
      "max_disc": 100,
      "qty": 1,
      "disc1": 0,
      "disc2": 0,
      "disc3": 0,
      "discount": 0,
      "price": 65000,
      "discountLoyalty": 0,
      "typeCode": "P",
      "sellingPrice": 65000,
      "vouchercode": null,
      "bundleId": null,
      "vouchertype": null,
      "total": 65000
    }
  ],
  "service_detail": [],
  "bundle": [],
  "member": "BKS001002156",
  "woNumber": null,
  "wo": null,
  "unit": "BK2031ER",
  "employee": "000005",
  "voucherPayment": []
}


function checkPrecisionObject (oldObject, newObject) {
  let precision = true
  let notCollapse = {}
  for(let news in newObject) {
    let deepDiffOld = undefined
    let deepDiffNew = undefined
    const newVar = newObject[news] || null
    const oldVar = oldObject[news] || null
    if(typeof newVar === 'number' || typeof newVar === 'string' || newVar === null) {
      // console.log(oldVar, ' ==== ', newVar)
      if(oldVar !== newVar) { precision = false }
      
    } else {
      if(news === 'voucherPayment' && newVar.length !== oldVar.length) { precision = false }
      else {
        // compare which object that contains greatest length of object
        const greatestObject = oldVar.length > newVar.length ? 'old' : 'new'
        const repackObject = { old: oldVar, new: newVar }
        const tempObj01 = repackObject[greatestObject]
        const tempObj02 = greatestObject === 'new' ? repackObject['old'] : repackObject['new']
        // end
        for(let index in tempObj01) {
          const typeItem = news === 'cashier_trans' ? 'productcode' : 'code'
          const getDetailNew = tempObj02.filter(x => x[typeItem] === tempObj01[index][typeItem])[0]
          const detailNew = getDetailNew || null
          const tmpOld = greatestObject === 'old' ? tempObj01[index] : detailNew 
          const tmpNew = greatestObject === 'new' ? tempObj01[index] : detailNew 
          if(!getDetailNew) {
            deepDiffOld = tmpOld
            deepDiffNew = tmpNew
            precision = false
            break
          } else {
            for(let x in tmpOld) {
              const tmpOldVar = tmpOld[x] || null
              const tmpNewVar = tmpNew[x] || null
              if(typeof tmpOldVar === 'number' || typeof tmpOldVar === 'string' || tmpOldVar === null) {
                // console.log(oldVar, ' ==== ', newVar)
                if(tmpOldVar !== tmpNewVar) {
                  deepDiffOld = { [x]: tmpOldVar }
                  deepDiffNew = { [x]: tmpNewVar }
                  precision = false
                } 
              }
            }
          }   
        }
      }
    }
    if(!precision) {
      notCollapse = {
        ...notCollapse,
        [news]: {
          old: deepDiffOld !== undefined ? deepDiffOld : oldVar,
          new: deepDiffNew !== undefined ? deepDiffNew : newVar
        }
      }
      break
    }
  }
  return { precision, notCollapse }
}


console.log(checkPrecisionObject(oldValue, newValue))