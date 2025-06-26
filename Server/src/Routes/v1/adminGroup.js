import {Router} from 'express'
import { createAdmin, getAdminInfo, getAllAdmins, loginAdmin, updateAdminById, updateAdminPassword } from '../../Controllers/adminController.js'
import {adminAuth} from '../../Middleware/adminAuth.js'




const router = Router()

router.post('/create',adminAuth, createAdmin)
router.post('/login', loginAdmin)
router.get('/info',adminAuth, getAdminInfo)
router.get('/all',adminAuth, getAllAdmins)
router.put('/update/:id',adminAuth, updateAdminById)
router.put('/password/:id',adminAuth, updateAdminPassword)




export default router