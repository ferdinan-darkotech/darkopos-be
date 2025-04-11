import request from '../../../../utils/request'

export function generateLinkDynamicForm ({
  license,
  formID,
  dataExt = {}
}) {
  return request({
    url: `${process.env.URL_DYNAMIC_FORM}/px/v1/form/publish/global/dynamic`,
    method: 'POST',
    data: {
      license,
      dataExt, 
      prefixName: 'dmi',
      formID
    }
  })
}