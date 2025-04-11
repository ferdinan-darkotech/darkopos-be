function toInjectDataTree (arr, item) {
  if (item.parentId === null || item.parentId === -1) {
    arr.push(item)
  } else {
    arr.map((x) => {
      if (x.id === item.parentId) {
        x.children = !x.children ? [] : x.children
        x.children.push(item)
      } else if (x.children) {
        x = toInjectDataTree(x.children, item)
      }
      return null
    })
  }
  return arr
}

function toFilterDataTree (dataCasc) {
  let arr = []
  dataCasc.map((item) => {
    arr = toInjectDataTree(arr, item)
    return null
  })
  return arr
}

function mappingToCascaderObj (fixData) {
  fixData.map((item) => {
    if (item.children) {
      mappingToCascaderObj(item.children)
    }
    const tmpChildren = item.children
    delete item.children
    item.value = item.code
    item.label = item.reportName
    item.children = tmpChildren
    delete item.id
    delete item.parentId
    delete item.code
    delete item.reportName
    return null
  })
  return fixData
}

export default function generateCascader (data) {
  const CascaderData = toFilterDataTree(data)
  const result = mappingToCascaderObj(CascaderData)
  return result
}