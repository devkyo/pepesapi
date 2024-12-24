import {Router} from 'express'

import productController from '../controllers/product.controller.js'
import  upload  from '../config/upload.js'

const router = Router();

router.get('/', productController.getAll);
router.post('/', upload.single('image') , productController.create);
router.get('/:id', productController.get)
router.put('/:id',upload.single('image'), productController.update)
router.delete('/:id',productController.delete)

export default router

