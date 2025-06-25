import {Router}  from 'express'
import productGroup from './productGroup.js'
import userGroup from './userGroup.js'


const router = Router()


router.use("/product", productGroup)
router.use("/user", userGroup)



export default router