import jwt from 'passport-jwt'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import project from '../../config/project.config'
import { getUserByUserId } from '../services/v1/usersService'
import { isValidPassword, generateToken, reGenerateToken, extractTokenProfile } from '../services/v1/securityService'

const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const localOptions = {usernameField: 'userid'}

// Local login strategy
const localLogin = new LocalStrategy(localOptions, function (userid, password, done) {
  console.log('Requesting-LocalStrategy: ' + userid + ' ...')
  getUserByUserId(userid).then(user => {
    
    if (user === null || !isValidPassword(password, user.hash, user.salt)) {
      return done(null, false, {error: 'Your login details could not be verified. Please try again.'})
    }

    return done(null, user)
  })
})

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Telling Passport where to find the secret
  secretOrKey: project.auth_secret
}


// Setting up JWT login strategy
const jwtLogin = new JwtStrategy({
  ...jwtOptions,
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      try {
        const { pureToken, ...userAuth } = extractTokenProfile(req, true)
        req.$userAuth = userAuth
        
        const bearer = req.headers.authorization.split(' ')[0]
        const newToken = `${bearer} ${pureToken}`
        return ExtractJwt.fromAuthHeader()({
          headers: { authorization: newToken }
        })
      } catch (_er) {
        return false
      }
    }
  ])
}, function (payload, done) {
  console.log('Requesting-JwtStrategy: ' + ' ...')
  if (payload.userid === 'temp') {
    return done(null, payload)
  } else {
    getUserByUserId(payload.userid).then((user,err) => {
      if (user === null) {
        return done(null, false)
      }

      return done(null, user)
    })
  }
})

function findKeyForUserId(id, fn) {
  return fn(null, keys[id]);

}

passport.use(jwtLogin)
passport.use(localLogin)
