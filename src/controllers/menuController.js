import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import { getMenuById, getMenuId, getMenuData, insertMenu, insertSomeMenu, updateMenu, deleteMenu, deleteSomeMenu, menuExists, idExists } from '../services/menuService'
import { extractTokenProfile } from '../services/v1/securityService'
import { isEmpty } from '../utils/check'

// Retrive list a Menu
exports.getMenuId = function (req, res, next) {
  console.log('Requesting-getMenuId: ' + req.url + ' ...')
  let id = req.params.id
  getMenuId(id).then((menu) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: menu
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Menu ${id}.`, err)))
}

exports.getMenuData = function (req, res, next) {
  console.log('Requesting-getMenuData: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getMenuData(other).then((menu) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(menu)),
      total: menu.length
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Menu Units.`, err)))
}

exports.insertMenu = function (req, res, next) {
  console.log('Requesting-createMenu: ' + req.url + ' ...')
  let id = req.params.id
  let menu = req.body
  const userLogIn = extractTokenProfile(req)
  menuExists(id).then(exists => {
    if (exists) {
      next(new ApiError(409, `Menu '${id}' already exists.`))
    } else {
      return insertMenu(id, menu, userLogIn.userid, next).then((menuId) => {
        return getMenuId(id).then((menu) => {
          res.xstatus(200).json({
            success: true,
            message: `Menu ${menu.name} created`,
            data: menu,
          })
        }).catch(err => next(new ApiError(422, err + ` - Couldn't find Menu ${id}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Menu ${id}.`, err)))
    }
  })
}

exports.insertSomeMenu = function (req, res, next) {
  console.log('Requesting-createSomeMenu: ' + req.url + ' ...')
  let menu = req.body.data
  const userLogIn = extractTokenProfile(req)
  return insertSomeMenu(menu, userLogIn.userid, next).then((menuId) => {
    if (menuId) {
      let jsonObj = {
        success: true,
        message: `${menu.length} menu created`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { menu: menu.data }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Menu ${menu} fail to create.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create Menu ${menu}.`, err)))
}

exports.updateMenuById = function (req, res, next) {
  console.log('Requesting-updateMenu: ' + req.url + ' ...')
  let id = req.params.id
  let menu = req.body
  const userLogIn = extractTokenProfile(req)
  idExists(id).then(exists => {
    if (exists) {
      return updateMenu(id, menu, userLogIn.userid, next).then((menuId) => {
        return getMenuById(id).then((menu) => {
          res.xstatus(200).json({
            success: true,
            message: `Menu ${menu.name} updated`,
            data: menu,
          })
        }).catch(err => next(new ApiError(422, err + ` - Couldn't find Menu ${id}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Menu ${id}.`, err)))
    } else {
      next(new ApiError(409, `Menu '${id}' is not exists.`))
    }
  })
}

exports.deleteMenuById = function (req, res, next) {
  console.log('Requesting-deleteMenu: ' + req.url + ' ...')
  let id = req.params.id
  let menu = req.body
  const userLogIn = extractTokenProfile(req)
  menuExists(id).then(exists => {
    if (exists) {
      return deleteMenu(id, next).then((menuId) => {
        if (menuId) {
          let jsonObj = {
            success: true,
            message: `Menu ${id} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { menu: menuId }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Menu ${id} fail to delete.`))
        }
      }).catch(err => next(new ApiError(501, `Couldn't delete Menu ${id}.`, err)))
    } else {
      next(new ApiError(409, `Menu '${id}' is not exists.`))
    }
  })
}

exports.deleteSomeMenuById = function (req, res, next) {
  console.log('Requesting-deleteSomeMenu: ' + req.url + ' ...')
  let id = req.body;
  const userLogIn = extractTokenProfile(req)
  return deleteSomeMenu(id.menuId, next).then((menuId) => {
    if (menuId) {
      let jsonObj = {
        success: true,
        message: `${menuId} menu deleted from ${id.menuId}`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { menu: id.menuId }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Menu [ ${id.menuId} ] fail to delete.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Menu [ ${id.menuId} ].`, err)))
}