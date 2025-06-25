import {Router} from 'express'
import { createProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct}  from '../../Controllers/productController.js'
import { upload } from '../../Middleware/imageUpload.js'
import { userAuth } from '../../Middleware/userAuth.js'



const router = Router()


router.post('/create',userAuth,upload.single("image"), createProduct)
router.get('/all',userAuth, getAllProducts)
router.put('/update/:id',userAuth,upload.single("image"), updateProduct)
router.get('/one/:id',userAuth, getOneProduct)

router.delete('/delete/:id',userAuth, deleteProduct)



export default router