export default function compareDiffObjects (data1 = {}, data2 = {}, attrCompare = {}, primaryObject = {}) {
  let result = false
  try {
    if(typeof data1 !== 'object') throw new Error('Data 1 is not object type ..')
    else if(typeof data2 !== 'object') throw new Error('Data 2 is not object type ..')
    else if((data1.length === undefined && +data2.length > 0) || (data2.length === undefined && +data1.length > 0)) {
      throw new Error('Format data diffrent ...')
    } else {
      if(data1.length === undefined) {
        for(let x in attrCompare) {
          if(data1[x] !== data2[attrCompare[x]]) {
            result = true
            break
          }
          continue
        }
      } else {
        if(data1.length !== data2.length) {
          result = true
        } else {
          let unmatch = false
          for(let x in data1) {
            let countScore = 0
            for(let y in data2) {
              let score = Object.getOwnPropertyNames(primaryObject).length
              for(let z in primaryObject) {
                if(data1[x][z] === data2[y][primaryObject[z]]) {
                  score -= 1
                }
              }

              if(score === 0) {
                for(let a in attrCompare) {
                  if(data1[x][a] !== data2[y][attrCompare[a]]) {
                    unmatch = true
                    break
                  }
                  continue
                } 
              } else {
                countScore += 1
              }

              if(unmatch) break
            }
            
            if(countScore === data2.length) {
              unmatch = true
              break
            }
            if(unmatch) break
          }
          result = unmatch
        }
      }
    }
    return (result || false)
  } catch (er) {
    console.log(er.message)
  }
}
