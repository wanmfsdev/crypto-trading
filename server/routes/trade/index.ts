import { Router } from 'express'
import getLatestPrice from './getLatestPrice'
import postOrder from './postOrder'
import cancelOrder from './cancelOrder'
import getTokenPairs from './getTokenPairs'
import getTokenData from './getTokenData'
import getOrderBooks from './getOrderBooks'
import deposit from './deposit'
import withdraw from './withdraw'

import tradeMiddleware from '../../middlewares/trade'

const router = Router()

router.get('/latest-price', getLatestPrice)
router.get('/get-token-pairs', getTokenPairs)
router.get('/get-token-data', getTokenData)
router.get('/get-orderbooks', getOrderBooks)

router.use(tradeMiddleware)
router.post('/post-order', postOrder)
router.post('/cancel-order', cancelOrder)
router.post('/deposit', deposit)
router.post('/withdraw', withdraw)

export default router
