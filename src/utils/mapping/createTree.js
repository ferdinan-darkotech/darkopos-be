const destructPayload = (payload = {}, dataAttr = []) => {
  // const objDataAttr = Object.getOwnPropertyNames(dataAttr)
  let results = {}
  for (let x in dataAttr) {
    if(Array.isArray(dataAttr[x])) {
      const initial = (dataAttr[x][0] || null)
      const replacer = (dataAttr[x][1] || null)
      results[replacer] = payload[initial]
    } else {
      results[dataAttr[x]] = payload[dataAttr[x]]
    }
    
  }

  return results
}


export default function buildTree (data, identifier, matcher, attributes) {
  let newData = []
  

  const insertChildren = (tmpData, objItems, identity, match) => {
    let newTmpData = [...tmpData]
    for(let k in tmpData) {
      let found = false
      let items = tmpData[k]
      if(objItems[identity] === items[match]) {
        items.children = [...(items.children || []), objItems]
        found = true
      } else {
        if(Array.isArray(items.children)) {
          items = insertChildren(items.children, objItems, identity, match)
        }
      }
      
      if(found) {
        newTmpData[k] = items
        break
      }
    }

    return newTmpData
  }

  for(let x in data) {
    const items = destructPayload(data[x], attributes)

    if(!items[identifier]) {
      newData.push(items)
    } else {
      newData = insertChildren(newData, items, identifier, matcher)
    }
  }

  return newData
}
