import db from '../../../models/tableR'
import { getMiscByCode } from '../../v1/miscService'
import { srvGetLovCOA } from '../../v2/master/finance/srvCOA'

const tbDivision = db.tbl_division
const tbDepartment = db.tbl_department

const divisionAttr = ['divcode', 'divname']
const departmentAttr = ['deptcode', 'deptname']

function getDepartmentLov () {
  return tbDepartment.findAll({
    attributes: departmentAttr,
    raw: true
  })
}

function getDivisionLov () {
  return tbDivision.findAll({
    attributes: divisionAttr,
    raw: true
  })
}

export function srvGetOneDivisionLovByCode (divcode) {
  return tbDivision.findOne({
    attributes: divisionAttr,
    where: { divcode },
    raw: true
  })
}

export function srvGetOneDepartmentLovByCode (deptcode) {
  return tbDivision.findOne({
    attributes: departmentAttr,
    where: { deptcode },
    raw: true
  })
}

export function srvLovCashEntry () {
  let newData = {}
   return new Promise(async (resolve, reject) => {
    const lovValue = { fields: 'miscName,miscDesc', for: 'lov' }
    const ceCOA = await srvGetLovCOA({ mode: 'children-only' })
    const ceTransKind = JSON.parse(JSON.stringify((await getMiscByCode('CETRNSKIND', lovValue))))
    const ceTransType = JSON.parse(JSON.stringify((await getMiscByCode('CETRNSTYP', lovValue))))
    const dtDepartment = await getDepartmentLov()
    const dtDivision = await getDivisionLov()

    newData = {
      transkind: ceTransKind,
      transtype: ceTransType,
      department: dtDepartment,
      division: dtDivision,
      coa: ceCOA
    }

    resolve({ success: true, data: newData })
   })
}
