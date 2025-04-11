import dbv from '../../models/viewR'
import sequelize from '../../native/sequelize'
import sequelizex from 'sequelize'


const traceProcess = dbv.vw_trace_process

export function validationProcess(data, topOf = 3) {
  return traceProcess.findAll({
		where: { $and: [{query: { $iRegexp: data.querying }}, {query: { $notIRegexp: 'vw_trace_process' }}],  }
	}).then(rs => {
		const result = JSON.parse(JSON.stringify(rs))
		if(result.length <= topOf) return true
		else return false
	}).catch(er => er)
} 