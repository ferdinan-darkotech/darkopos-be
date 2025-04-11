import cloudinary from 'cloudinary'

const _LIST_PATH_CLOUDINARY = {
  'ADS-BANNER': '/POS-ADS-BANNER'
}

const _PREFIX_ENV = {
  development: 'DEVELOPMENT',
  production: 'PRODUCTION',
  test: 'TESTING'
}[process.env.NODE_ENV] || 'DEVELOPMENT'

export function cloudUpdatedFile (folder = null, oldPublicId = null, file = null) {
  return cloudDeleted(oldPublicId)
    .then(deleted => {
      if(deleted.success) {
        return cloudUploader(folder, file)
          .then(ok => ok)
      }
    })
    .catch(er => er)
}


export function cloudUploader (folder = null, file = null) {
  return new Promise((resolve, reject) => {
    const specificFolder = _LIST_PATH_CLOUDINARY[folder]
    let dataFile = null
    if(!specificFolder) reject('File path from cloud is not found.')
    else if(!file || file === '' || typeof file === 'object') reject('No data saved to cloud.')
    else dataFile = file

    return cloudinary.v2.uploader.upload(
      dataFile,
      { 
        folder: `/${_PREFIX_ENV}${specificFolder}`
      }, (error, result) => {
        
        if(error) {
          reject(error)
        } else {
          resolve(result)
        }
      }).catch(er => reject(er))
  })
}


export function cloudDeleted (public_id) {
  return new Promise((resolve, reject) => {
    return cloudinary.v2.uploader.destroy(
      public_id,
      (error, result) => {
        if(error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
  }).then(ok => ({ success: true, data: ok })).catch(er => ({ success: false, message: er.message }))
}
