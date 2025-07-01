import {Router}  from 'express'
import productGroup from './productGroup.js'
import userGroup from './userGroup.js'
import adminGroup from './adminGroup.js'
import cartGroup from './cartGroup.js'
import paystackGroup from './paystackGroup.js'


const router = Router()


router.use("/product", productGroup)
router.use("/user", userGroup)
router.use("/admin",adminGroup)
router.use("/cart", cartGroup )
router.use('/paystack', paystackGroup)



export default router