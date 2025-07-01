import {Router}  from 'express'
import {userAuth} from '../../Middleware/userAuth.js'
import { addProductToCart, clearCart, getAllItemsCart, removeItemCart, updateCartItem } from '../../Controllers/cartController.js'


const router = Router()

router.post('/add',userAuth, addProductToCart)
router.put('/update',userAuth, updateCartItem)
router.get('/all',userAuth, getAllItemsCart)
router.delete('/remove/:productId',userAuth, removeItemCart)
router.delete('/clear', userAuth, clearCart)



export default router