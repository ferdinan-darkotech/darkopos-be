import { ApiError } from '../../../../services/v1/errorHandlingService'
import { 
  srvGetDataMemberLovByType, srvGetDataMemberLov, srvGetSomeDataLov,
  srvCreateDataMemberLov, srvUpdateDataMemberLov, srvGetDataMemberLovByID
} from '../../../../services/v2/master/customer/srvCustomerLov'


export function ctlGetSomeMemberBranch (req, res, next) {
  console.log('Requesting-ctlGetSomeMemberBranch:' + req.url + ' ...')
  
  return srvGetSomeDataLov('BRANCH', req.query).then(lovs => {
    res.xstatus(200).json({
      success: true,
      data: lovs.rows,
      page: +(req.query.page || 1),
      pageSize: +(req.query.pageSize || 20),
      total: lovs.count
    })
  }).catch(err => next(new ApiError(422, `MLOV-00001: Couldn't find Customer Branch`, err)))
}

export function ctlGetDataMemberBranch (req, res, next) {
  console.log('Requesting-ctlGetDataMemberBranch:' + req.url + ' ...')

  return srvGetDataMemberLovByType('BRANCH', req.query.search).then(result => {
    return res.xstatus(200).json({
      success: true,
      data: result,
      total: result.length
    })
  }).catch(err => next(new ApiError(422, `MLOV-00002: Couldn't find Customer Branch`, err)))
}


export function ctlGetDataMemberLov (req, res, next) {
  console.log('Requesting-ctlGetDataMemberLov:' + req.url + ' ...')

  return srvGetDataMemberLov(req.query).then(result => {
    return res.xstatus(200).json({
      success: true,
      data: result.rows,
      total: result.count,
      pageSize: parseInt(pageSize || 20),
      page: parseInt(page || 1),
    })
  }).catch(err => next(new ApiError(422, `MLOV-00003: Couldn't find Customer LOV`, err)))
}

export function ctlCreateDataMemberBranch (req, res, next) {
  console.log('Requesting-ctlCreateDataMemberBranch:' + req.url + ' ...')
  
  const data = req.body
  const userLogin = req.$userAuth
  if (typeof data.lov_desc !== 'string' || data.lov_desc === '')
    return next(new ApiError(422, `MLOV-00003: Couldn't find Customer LOV`, 'Description cannot be null or empty.'))

  return srvCreateDataMemberLov({
    lov_type: 'BRANCH',
    lov_desc: data.lov_desc.toUpperCase(),
    user: userLogin.userid
  }).then(result => {
    return res.xstatus(200).json({
      success: true,
      message: 'Data has been saved.'
    })
  }).catch(err => next(new ApiError(422, `MLOV-00004: Couldn't create Customer Branch`, err)))
}


export function ctlUpdateDataMemberBranch (req, res, next) {
  console.log('Requesting-ctlCreateDataMemberBranch:' + req.url + ' ...')
  
  const data = req.body
  const userLogin = req.$userAuth
  if (typeof data.lov_desc !== 'string' || data.lov_desc === '')
    return next(new ApiError(422, `MLOV-00003: Couldn't find Customer LOV`, 'Description cannot be null or empty.'))

  return srvGetDataMemberLovByID('BRANCH', req.params.ids).then(exs => {
    if (!exs) throw new Error('Data is not exists.')

    return srvUpdateDataMemberLov(req.params.ids, {
      lov_desc: data.lov_desc.toUpperCase(),
      user: userLogin.userid
    }).then(result => {
      return res.xstatus(200).json({
        success: true,
        message: 'Data has been saved.'
      })
    }).catch(err => next(new ApiError(422, `MLOV-00005: Couldn't update Customer Branch`, err)))
  }).catch(err => next(new ApiError(422, `MLOV-00004: Couldn't update Customer Branch`, err)))
}