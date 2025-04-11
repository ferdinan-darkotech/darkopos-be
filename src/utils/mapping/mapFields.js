export default function mapFields (data, attribute, mode = 'multi') {
  let tmpResult = []
  
  if(mode === 'multi') {
    const arrData = data.rows || data
    arrData.map((data, index) => {
      let tmpObject = {}
      attribute.map(x => {
        tmpObject[x] = data[x.toLowerCase()] 
      })
      tmpResult.push(tmpObject)    
    })
  } else {
    tmpResult = {}
    attribute.map(x => {
      tmpResult[x] = data[x.toLowerCase()] 
    })
  }
  return data.rows && mode !== 'single' ? { ...data, rows: tmpResult } : tmpResult
}