import counterRouter from './counterRouter'
import shiftRouter from './shiftRouter'
import userRouter from './cashierRouter'
import cashRegisterRouter from './cashRegisterRouter'
import transactionsRouter from './transactionsRouter'

const routesCashier = (app) => {
  app.use(counterRouter)
  app.use(shiftRouter)
  app.use(userRouter)
  app.use(cashRegisterRouter)
  app.use(transactionsRouter)
}

export default routesCashier
