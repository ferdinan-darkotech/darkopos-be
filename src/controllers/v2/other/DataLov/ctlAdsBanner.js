import { ApiError } from '../../../../services/v1/errorHandlingService'
import * as ads from '../../../../services/v2/other/DataLov/srvAdsBanner'
import { srvGetStoreBranch } from '../../../../services/v2/master/store/srvStore'
import * as cloud  from '../../../../middleware/cloudinary'


export function ctlGetSomeAdsBanner (req, res, next) {
  console.log('Requesting-ctlGetSomeAdsBanner: ' + ' ...')
  const userLogIn = req.$userAuth

  return srvGetStoreBranch(userLogIn.store).then(branch => {
    if(!branch) throw 'The branch of store is not defined, please contact the IT Support.'
    return ads.srvGetSomeAdsBanner(req.query, branch.parent_store_id).then(rs => {
      res.xstatus(200).json({
        success: true,
        data: rs.rows,
        total: rs.count,
        page: +(req.query.page || 1),
        pageSize: +(req.query.pageSize || 10),
      })
    }).catch(er => next(new ApiError(422, `ER-ADSBNR002: Couldn't get banner ads`, er)))
  }).catch(er => next(new ApiError(422, `ER-ADSBNR001: Couldn't get banner ads`, er)))
}

export function ctlGetAllAdsBanner (req, res, next) {
  console.log('Requesting-ctlGetAllAdsBanner: ' + ' ...')
  const userLogIn = req.$userAuth

  return srvGetStoreBranch(userLogIn.store).then(async branch => {
    if(!branch) throw 'The branch of store is not defined, please contact the IT Support.'

    return ads.srvGetAllAdsBanner(branch.parent_store_id).then(rs => {
      res.xstatus(200).json({
        success: true,
        data: rs,
        total: rs.length
      })
    }).catch(er => next(new ApiError(422, `ER-ADSBNR004: Couldn't get banner ads`, er)))
  }).catch(er => next(new ApiError(422, `ER-ADSBNR003: Couldn't get banner ads`, er)))
}

export function ctlCreateAdsBanner (req, res, next) {
  console.log('Requesting-ctlCreateAdsBanner: ' + ' ...')
  const userLogIn = req.$userAuth

  let dataBody = req.body
  return srvGetStoreBranch(userLogIn.store).then(async branch => {
    if(!branch) throw 'The branch of store is not defined, please contact the IT Support.'

    if(typeof req.body.imgB64 === 'string') {
      const cloudImg = await cloud.cloudUploader('ADS-BANNER', req.body.imgB64)
      dataBody['img_url'] = cloudImg.secure_url
    } else {
      throw new Error('Please make sure the image before uploaded.')
    }
    return ads.srvCreateAdsBanner({ ...dataBody, users: userLogIn.userid }, branch.parent_store_id).then(rs => {
      res.xstatus(200).json({
        success: true,
        message: 'Banner ads created'
      })
    }).catch(er => next(new ApiError(422, `ER-ADSBNR006: Couldn't create banner ads`, er)))
  }).catch(er => next(new ApiError(422, `ER-ADSBNR005: Couldn't create banner ads`, er)))
}

export function ctlUpdateAdsBanner (req, res, next) {
  console.log('Requesting-ctlUpdateAdsBanner: ' + ' ...')
  const userLogIn = req.$userAuth

  let dataBody = req.body
  return srvGetStoreBranch(userLogIn.store).then(async branch => {
    if(!branch) throw 'The branch of store is not defined, please contact the IT Support.'

    if(typeof req.body.imgB64 === 'string') {
      const cloudImg = await cloud.cloudUploader('ADS-BANNER', req.body.imgB64)
      dataBody['img_url'] = cloudImg.secure_url
    }
    return ads.srvUpdateAdsBanner({ ...dataBody, users: userLogIn.userid }, branch.parent_store_id, { item_code: req.params.code }).then(rs => {
      res.xstatus(200).json({
        success: true,
        message: 'Banner ads updated'
      })
    }).catch(er => next(new ApiError(422, `ER-ADSBNR008: Couldn't update banner ads`, er)))
  }).catch(er => next(new ApiError(422, `ER-ADSBNR007: Couldn't update banner ads`, er)))
}