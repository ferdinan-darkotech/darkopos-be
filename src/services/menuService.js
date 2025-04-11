import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'

let Menu = db.tbl_menu

const menuFields = ['id', 'menuId', 'icon', 'name', 'bpid', 'mpid', 'route', 'sorting', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']

export function getMenuId (menu) {
  return Menu.findOne({
    where: {
      menuId: menu
    },
    raw: false
  })
}

export function getMenuById (menu) {
  return Menu.findOne({
    where: {
      id: menu
    },
    raw: false
  })
}

export function getMenuData (query) {
  const { type, field, order, ...other } = query
  if (query) {
    return Menu.findAll({
      attributes: field ? field.split(',') : menuFields,
      where: {
        ...other
      },
      order: ['sorting', 'menuId']
    })
  } else {
    return Menu.findAll({
      attributes: field ? field.split(',') : menuFields,
      order: ['sorting', 'menuId']
    })
  }
}

export function menuExists (menuId) {
  return getMenuId(menuId).then(menu => {
    if (menu === null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function idExists (menuId) {
  return getMenuById(menuId).then(menu => {
    if (menu === null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function insertMenu (menuId, menu, createdBy, next) {
  console.log('insertMenu', menuId)
  return Menu.create({
    menuId: menuId,
    icon: menu.icon,
    name: menu.name,
    bpid: menu.bpid,
    mpid: menu.mpid,
    route: menu.route,
    createdBy: createdBy,
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function insertSomeMenu (menu, createdBy, next) {
  console.log('insertSomeMenu', menu)
  let menuData = []
  for (let key in menu) {
    menuData.push({
      menuId: menu[key].menuId,
      icon: menu[key].icon,
      name: menu[key].name,
      bpid: menu[key].bpid,
      mpid: menu[key].mpid,
      route: menu[key].route,
      createdBy: createdBy,
    })
  }
  return Menu.bulkCreate(
    menuData
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateMenu (id, menu, updatedBy, next) {
  console.log('updateMenu', menu)
  return Menu.update({
    menuId: menu.menuId,
    icon: menu.icon,
    name: menu.name,
    bpid: menu.bpid,
    mpid: menu.mpid,
    route: menu.route,
    updatedBy: updatedBy
  },
    { where: { id: id } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteMenu (menuid, next) {
  return Menu.destroy({
    where: {
      menuId: menuid
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteSomeMenu (menuid, next) {
  return Menu.destroy({
    where: {
      menuId: menuid
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}