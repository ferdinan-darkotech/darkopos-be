import axios from 'axios'

async function requestMap (params = '', waypoints = false) {
  return axios.request({
    method: 'GET',
    url: `http://router.project-osrm.org/route/v1/driving/${params}?overview=false&skip_waypoints=${!waypoints}`
  })
}


export function srvGetDistanceTwoPointByRoute (fromPoint, toPoint) {
  try {
    const [fromLat, fromLng] = Array.isArray(fromPoint) ? fromPoint : []
    const [toLat, toLng] = Array.isArray(toPoint) ? toPoint : []

    if(typeof fromLat !== 'number' && isNaN(parseFloat(fromLat))) throw new Error('Start point of latitude had a wrong format.')
    else if(typeof fromLng !== 'number' && isNaN(parseFloat(fromLng))) throw new Error('Start point of longtidude had a wrong format.')
    else if(typeof toLat !== 'number' && isNaN(parseFloat(toLat))) throw new Error('End point of latitude had a wrong format.')
    else if(typeof toLng !== 'number' && isNaN(parseFloat(toLng))) throw new Error('End point of longtidude had a wrong format.')

    return requestMap(`${fromLng},${fromLat};${toLng},${toLat}`).then(data => {
      const results = data.data
      let toReturn = null

      if(results.code === 'Ok') {
        const { weight_name, weight, duration, distance } = (results.routes[0] || {})
        toReturn = {
          weight_name,
          weight,
          duration,
          distances: {
            m: distance,
            km: distance / 1000.0,
            round_km: Math.round(distance / 1000.0)
          },
        }
      }

      return toReturn
    })
  } catch (er) {
    throw er
  }
}

export function srvGetNearestObjectByRoute (startPoint = '', listTargets = []) { // long,lat;[...long,lag]
  try {
    let paramsPost = []

    for (let x in listTargets) {
      const items = listTargets[x]

      paramsPost.push(startPoint)
      paramsPost.push(`${items.longitude},${items.latitude}`)
    }
    
    return requestMap(paramsPost.join(';')).then(data => {
      const results = data.data
      let toReturn = null

      if(results.code === 'Ok') {
        let nearestObject = { data: {}, distance: null }

        let routeIndex = 0
        let index = 0
        for (let a in (results.routes[0] || {}).legs) {
          routeIndex += 1
          const { distance } = ((results.routes[0] || {}).legs[a] || [])

          if(routeIndex % 2 === 0) continue

          if(nearestObject.distance === null || distance < nearestObject.distance) {
            nearestObject = { data: (listTargets[index] || {}), distance: distance }
          }
          index += 1
        }
        
        return {
          ...nearestObject,
          distances: {
            m: nearestObject.distance,
            km: nearestObject.distance / 1000.0,
            round_km: Math.round(nearestObject.distance / 1000.0)
          },
        }
      }

      return toReturn
    })
  } catch (er) {
    throw er
  }
}
