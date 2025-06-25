import {Router}  from 'express'
import productGroup from './productGroup.js'
import userGroup from './userGroup.js'
import adminGroup from './adminGroup.js'


const router = Router()


router.use("/product", productGroup)
router.use("/user", userGroup)
router.use("/admin",adminGroup)



export default router