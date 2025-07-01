import express  from 'express';
import {Router} from 'express';
import { initializePayment, paystackWebhook } from '../../Controllers/paystackController.js'
import { userAuth } from '../../Middleware/userAuth.js'







const router = Router()

router.post('/pay', userAuth, initializePayment)
router.post('/webhook', paystackWebhook)

export default router