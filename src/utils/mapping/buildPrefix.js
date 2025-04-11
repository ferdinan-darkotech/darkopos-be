export default function buildPrefixData (prefix = null, data = {}) {
  let results = []
  const unknownData = 'DXAX01920'

  const matchPrefix = prefix.match(/{([A-Za-z0-9_])+((::(ARR|STR)))?}/g)
  let arrKeys = 0
  let tmpPrefix = prefix

  if(!prefix) return []
  
  for (let x in matchPrefix) {
    const pref = matchPrefix[x]
    const params = pref.replace(/}|{/g, '')
    const keys = params.split('::')[0]
    const types = (params.split('::')[1] || 'STR')
  
    if(results.length > 0) {
      for(let y in results) {
        if(types === 'STR' && typeof data[keys] === 'string') {
          results[y] = results[y].replace(pref, data[keys])
        } else {
          results[y] = results[y].replace(pref, unknownData)
        }
      }
    } else {
      if(types === 'STR' && !!data[keys] && typeof data[keys] === 'string') {
        tmpPrefix = tmpPrefix.replace(pref, data[keys])
      } else if (types === 'ARR' && Array.isArray(data[keys])) {
        for(let y in data[keys]) {
          if(typeof data[keys][y] === 'string') {
            let deepthPrefix = tmpPrefix.replace(pref, data[keys][y])
            results.push(deepthPrefix)
          }
        }
      } else {
        tmpPrefix = tmpPrefix.replace(pref, unknownData)
      }
    }
  }
  
  if(results.length === 0) results.push(tmpPrefix)
  
  let toCheckUnknown = results.join('-')
  
  if(toCheckUnknown.match(unknownData)) results = []

  return results;
}