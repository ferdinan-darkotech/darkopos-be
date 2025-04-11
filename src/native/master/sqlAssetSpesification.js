const sqlCarBrands = 'SELECT a.id, a.brandName as "brandName" FROM tbl_member_asset_brand a ' +
  "_ORDER01" + "_LIMIT01"
const sqlCarModels = 'SELECT a.id, a.modelName as "modelName" FROM tbl_member_asset_model a ' +
  "WHERE a.active and a.brandId = " + "_BIND01" + "_ORDER01" + "_LIMIT01"
const sqlCarTypes = 'SELECT a.id, a.typeName as "typeName" FROM tbl_member_asset_type a ' +
  "WHERE a.active and a.modelId = " + "_BIND01" + "_ORDER01" + "_LIMIT01"

const sqlCarBrand = 'SELECT a.id, a.brandName as "brandName" FROM tbl_member_asset_brand a ' +
  "WHERE " + "_BIND01" + "_ORDER01" + "_LIMIT01"
const sqlCarModel = 'SELECT a.id, a.modelName as "modelName" FROM tbl_member_asset_model a ' +
  "WHERE " + "_BIND01" + "_ORDER01" + "_LIMIT01"
const sqlCarType = 'SELECT a.id, a.typeName as "typeName" FROM tbl_member_asset_type a ' +
  "WHERE " + "_BIND01" + "_ORDER01" + "_LIMIT01"

const native = {
  sqlCarBrands,
  sqlCarModels,
  sqlCarTypes,
  sqlCarBrand,
  sqlCarModel,
  sqlCarType
}

module.exports = native