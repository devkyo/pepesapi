import {Router} from 'express'

import userController from '../controllers/user.controller.js'
import authController from '../controllers/auth.controller.js'
import verifyTokenMiddleware  from '../middlewares/auth.middleware.js'


const router = Router();

router.get('', userController.getAll)
router.post('', userController.create)
router.post('/login', authController.login)
router.get('/profile',verifyTokenMiddleware,  userController.profile)
// router.put('/:id',productController.update)
// router.delete('/:id',productController.delete)

export default router

