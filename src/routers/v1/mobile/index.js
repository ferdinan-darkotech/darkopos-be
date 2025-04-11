import mobileBookingRouter from './bookingRouter'
import mobileMembersRouter from './membersRouter'
import mobileOutletRouter from './outletRouter'

const routesMobile = (app) => {
  app.use(mobileBookingRouter)
  app.use(mobileBookingRouter)
  app.use(mobileOutletRouter)
}

export default routesMobile
