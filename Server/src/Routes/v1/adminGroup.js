import {Router} from 'express'
import { createAdmin, loginAdmin } from '../../Controllers/adminController.js'
import {adminAuth} from '../../Middleware/adminAuth.js'




const router = Router()

router.post('/create', createAdmin)
router.post('/login', loginAdmin)


export default router