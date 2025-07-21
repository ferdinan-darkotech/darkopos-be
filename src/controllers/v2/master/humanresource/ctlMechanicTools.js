const { ApiError } = require("../../../../services/v1/errorHandlingService")
const { fetchMechanics, addNewToolOnMechanic, removeMechanicTool, fetchMechanicToolsByEmployeeCode, fetchMechanicTools, fetchAllMechanicTools, fetchAllMechanicToolsByEmployeeCode, updateSoftRemoveMechanicTool, fetchMechanicToolsInventory, fetchMechanicToolByToolAndMechanic, createSaldoAwalMehanicTools, fetchMechanicToolsSaldoFormatByEmployeeCode, fetchMonthAndYearSaldoPeriod } = require("../../../../services/v2/master/humanresource/srvMechanicTools")

const getMechanics = async function (req, res, next, comment = 'getMechanics') {
    console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  
    return fetchMechanics(req.query).then((mechanic) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        data: mechanic
      })
    }).catch(err => next(new ApiError(422, `ZCEP-00001: Couldn't find getMechanics`, err)))
}

const createMechanicTool = async function (req, res, next, comment = 'createMechanicTools') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')

  const user = req.$userAuth

  return addNewToolOnMechanic(req.body, user.userid).then((mechanic) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: mechanic
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00002: Couldn't create this tool`, err)))
}

const getMechanicToolsByEmployeeCode = async function (req, res, next, comment = 'getMechanicToolsByEmployeeCode') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  
  const employeecode = req.params.employeecode

  const { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize: parseInt(pageSize || 6),
    page: parseInt(page || 1),
  }

  return fetchMechanicToolsByEmployeeCode(employeecode, other, pagination).then((tools) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pagination.pageSize,
      page: pagination.page,
      total: tools.count,
      data: JSON.parse(JSON.stringify(tools.rows))
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00003: Couldn't find tools on this mechanic`, err)))
}

const printMechanicToolsByEmployeeCode = async function (req, res, next, comment = 'printMechanicToolsByEmployeeCode') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  
  const employeecode = req.params.employeecode

  return fetchAllMechanicToolsByEmployeeCode(employeecode, req.query).then((tools) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: tools
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00003: Couldn't find tools on this mechanic`, err)))
}

const getMechanicTools = async function (req, res, next, comment = 'getMechanicTools') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')

  const { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }

  return fetchMechanicTools(other, pagination).then((tools) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pagination.pageSize,
      page: pagination.page,
      total: tools.count,
      data: JSON.parse(JSON.stringify(tools.rows))
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00007: Couldn't find tools on this mechanic`, err)))
}

const printMechanicTools = async function (req, res, next, comment = 'printMechanicTools') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  const storecode = req.query.storecode

  return fetchAllMechanicTools(storecode, req.query).then((tools) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: tools
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00006: Couldn't find tools on this mechanic`, err)))
}

const deleteMechanicTool = async function (req, res, next, comment = 'deleteMechanicTools') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  
  const { employeecode, id } = req.params
  const user = req.$userAuth

  const payload = {
    memo: req.body.memo,
    deletedby: user.userid
  }

  return removeMechanicTool(id, employeecode).then((response) => {
    if (response) {
      updateSoftRemoveMechanicTool(id, employeecode, payload).then((response) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: response
        })
      }).catch(err => next(new ApiError(422, `ZCEP-00004: Couldn't remove tool on this mechanic from tbl_mechanic_tool`, err)))
    }
  }).catch(err => next(new ApiError(422, `ZCEP-00005: Couldn't create tool on tbl_mechanic_tool_log`, err)))

  // return addSoftRemoveMechanicTool(id, payload, user.userid).then((response) => {
  //   if (response) {
  //     removeMechanicTool(id, employeecode).then((response) => {
  //       res.xstatus(200).json({
  //         success: true,
  //         message: 'Ok',
  //         data: response
  //       })
  //     }).catch(err => next(new ApiError(422, `ZCEP-00004: Couldn't remove tool on this mechanic from tbl_mechanic_tool`, err)))
  //   }
  // }).catch(err => next(new ApiError(422, `ZCEP-00005: Couldn't create tool on tbl_mechanic_tool_log`, err)))
}

// [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
const getMechanicToolsInventory = async function (req, res, next, comment = 'getMechanicToolsInventory') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')

  const { pageSize, page, ...other } = req.query

  return fetchMechanicToolsInventory(other, { pageSize: parseInt(pageSize || 10), page: parseInt(page || 1) }).then((tools) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: parseInt(pageSize || 10),
      page: parseInt(page || 1),
      total: tools.count,
      data: JSON.parse(JSON.stringify(tools.rows))
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00007: Couldn't find tools on this mechanic`, err)))
}

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
const checkMechanicToolBeforeInsert = async function (req, res, next, comment = 'checkMechanicToolBeforeInsert') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')

  const { employeecode, toolcode } = req.params

  return fetchMechanicToolByToolAndMechanic(toolcode, employeecode).then((tool) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: tool
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00007: Couldn't find tools on this mechanic`, err)))
}

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
const generateSaldoAwalMehanicTools = async function (req, res, next, comment = 'generateSaldoAwalMehanicTools') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')

  const { tahun, bulan, createdby } = req.body

  return createSaldoAwalMehanicTools({ tahun, bulan, createdby }).then((tool) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: tool && tool.length > 0 && tool[0][0].val ? { result: tool[0][0].val } : {}
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00007: Tidak bisa generate saldo awal`, err)))
}

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
const getMonthAndYearSaldoPeriod = async function (req, res, next, comment = 'getMonthAndYearSaldoPeriod') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')

  return fetchMonthAndYearSaldoPeriod(req.query).then((tool) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: tool
    })
  }).catch(err => next(new ApiError(422, `ZCEP-00007: No Month And Year Saldo Period in DB`, err)))
}

module.exports = {
  getMechanics,
  createMechanicTool,
  getMechanicToolsByEmployeeCode,
  deleteMechanicTool,
  getMechanicTools,
  printMechanicTools,
  printMechanicToolsByEmployeeCode,

  // [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
  getMechanicToolsInventory,

  // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
  checkMechanicToolBeforeInsert,
  generateSaldoAwalMehanicTools,
  getMonthAndYearSaldoPeriod
}
