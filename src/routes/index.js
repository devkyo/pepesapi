import { Router } from 'express'
import productRoutes from '../routes/product.routes.js'
import userRoutes from '../routes/user.routes.js'


const router = Router()
const apiRoutes = Router()

router.use('/products', productRoutes)
router.use('/users', userRoutes)

export default router


