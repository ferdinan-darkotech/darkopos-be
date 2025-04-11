/**
 * Created by wi on 20190131.
 */

// jsonOpr
// json operation / manipulation

// return an array of objects according to key, value, or key and value matching
function getObjects (obj, key, val) {
  let objects = []
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (typeof obj[i] === 'object') {
        objects = objects.concat(getObjects(obj[i], key, val))
      } else
      // if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
      if ((i === key && obj[i] === val) || (i === key && val === '')) { //
        objects.push(obj)
      } else if (obj[i] === val && key === '') {
        // only add if the object is not already in the array
        if (objects.lastIndexOf(obj) === -1) {
          objects.push(obj)
        }
      }
    }
  }
  return objects
}

// https://stackoverflow.com/questions/2631001/test-for-existence-of-nested-javascript-object-key
function checkJSONNested (obj /* , level1, level2, ... levelN */) {
  let args = Array.prototype.slice.call(arguments, 1)

  for (let i = 0; i < args.length; i += 1) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false
    }
    obj = obj[args[i]]
  }
  return true
}

// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
function checkJSONValid(str) {
  let j
  try {
    if (typeof str === 'string') {
      j = JSON.parse(str)
    } else {
      if (str.length === undefined) {
        j = JSON.stringify(str)
      } else j = false
    }

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (j && typeof j === "object") {
      return j
    } else if (j && typeof j === "string") {
      return j
    }
  } catch (e) {}
  return false
}

// 1. https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
// 2. https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
const getNestedObject = (nestedObj, pathArr) =>
  pathArr.reduce((obj, key) => ((obj && obj[key]) ? obj[key] : null), nestedObj)

// boo - 20190415 16:07:35
const getNestedObjectLoop = (nestedObj, keyChildren, keyValue, keyPosition) => {
  let arrResult = []
  let arrPath = [0]
  let arrChild = [keyChildren, 0]
  let getObj
  let getResult
  let condition = true
  let index = 0
  do {
    getObj = getNestedObject(nestedObj, arrPath)
    index += 1
    if (getObj === null) {
      condition = false
    } else {
      if (keyValue && getObj.hasOwnProperty(keyValue)) { getResult = getObj[keyValue] } else { getResult = getObj }
      if (keyPosition && index <= keyPosition) condition = true
      arrResult = arrResult.concat(getResult)
      arrPath = arrPath.concat(arrChild)
    }
  } while (condition)
  return arrResult
}

const delUndefinedObject = (obj) => {
  for (let k in obj) if (obj[k] === undefined) delete obj[k]
  return obj
}

const isEmptyObject = (obj = {}) => {
  if (obj === null) {
    return true
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

// https://stackoverflow.com/questions/4647817/javascript-object-rename-key
const renameObjectKey = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key
    return { [newKey]: obj[key] }
  })
  return Object.assign({}, ...keyValues)
}

const calculateTax = ({
  price = 0,
  qty = 0,
  disc1 = 0,
  disc2 = 0,
  disc3 = 0,
  disc4 = 0,
  disc5 = 0,
  discnominal = 0
}, taxtype = 'E', taxpercent = 0) => {
  const newtaxpercent = taxpercent / 100.0
  const totalprice = (qty * price || 0.0)
  const dp1 = totalprice * (1 - ((disc1 || 0.0) / 100.0))
  const dp2 = dp1 * (1 - ((disc2 || 0.0) / 100.0))
  const dp3 = dp2 * (1 - ((disc3 || 0.0) / 100.0))
  const dp4 = dp3 * (1 - ((disc4 || 0.0) / 100.0))
  const dp5 = dp4 * (1 - ((disc5 || 0.0) / 100.0))
  let netto = 0, dpp = 0, ppn = 0
  let discounts = 0
  if (taxtype === 'I') {
    netto = Math.round(dp5 - discnominal)
    dpp = Math.round(netto * (100.0 / (100.0 + (taxpercent || 0.0))))
    ppn = Math.round(netto - dpp)
    discounts = (totalprice - netto)
  } else if (taxtype === 'E') {
    dpp = Math.round(dp5 - discnominal)
    ppn = Math.round(dpp * newtaxpercent)
    netto = Math.round(dpp + ppn)
    discounts = (totalprice - dpp)
  } else {
    throw new Error('Type tax is not defined')
  }
  
  return { price: totalprice, netto, dpp, ppn, discount: discounts }
}

const splittingRegexText = (replacer = {}, text = '') => text.replace(
    new RegExp(`:(${Object.getOwnPropertyNames(replacer).join('|')}):`,'g'),
    (match) => replacer[match.replace(/:/g, '')]
  )

export {
  getObjects,
  checkJSONNested,
  checkJSONValid,
  getNestedObject,
  getNestedObjectLoop,
  delUndefinedObject,
  isEmptyObject,
  renameObjectKey,
  calculateTax,
  splittingRegexText
}


// let temp1={
//   "reportParams": {
//     "report": [
//       "daily",
//       "daily-sale-edc",
//       "daily-sale-edc-format-01"
//     ]
//   }
// }
// let temp2={
//   "reportParams": {
//     "params": {
//       "store": 1,
//       "date": [
//         "2019-04-02",
//         "2019-04-03"
//       ]
//     }
//   }
// }

// let { report, params } = temp1.reportParams
// let { report: report2, params: params2 } = temp2.reportParams

// const removeUndefined = (obj) => {
//   for (let k in obj) if (obj[k] === undefined) delete obj[k];
//   return obj;
// }
// a = { report, params }
// b = { report2, params2 }
// a = removeUndefined(a)
// b = removeUndefined(b)
// reportParams = { ...a, ...b }
