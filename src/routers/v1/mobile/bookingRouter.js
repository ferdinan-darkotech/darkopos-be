import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { insertMobileBooking, selectMobileBooking, selectMobileBookings,
  updateMobileBookings, selectMobileBookingUpdateHistory }
  from '../../../controllers/mobile/bookingController'

const router = express.Router()

const apiRoute = project.api_prefix + '/mobile/booking'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/:id/history',
]

// MAIN //

router.post(apiRouter[1], requireAuth, insertMobileBooking)

router.get(apiRouter[1], requireAuth, selectMobileBooking)

router.get(apiRouter[0], requireAuth, selectMobileBookings)

router.put(apiRouter[1], requireAuth, updateMobileBookings)

router.get(apiRouter[2], requireAuth, selectMobileBookingUpdateHistory)

// MAIN //

export default router