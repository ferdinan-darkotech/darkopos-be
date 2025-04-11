/**
 * Created by boo on 6/27/17.
 */
export function isEmpty (obj = {}) {
  // #remark 1
  // for(var key in obj) {
  //   if(obj.hasOwnProperty(key))
  //     return false
  // }
  // return true
  // #remark 2
  // return Object.keys(obj).length === 0 && obj.constructor === Object
  // #remark 3
  // if (obj) {
  //   return false
  // } else {
  //   if (obj.constructor === Object) {
  //     return Object.keys(obj).length === 0
  //   } else {
  //     return true
  //   }
  // }
  // #now
  if (obj === null) {
    return true
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function imageFilter (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Image format must be jpg or png!'), false);
  }
  cb(null, true);
};
