import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import User from '../Models/user.model.js';
import crypto from 'crypto'
import {Logger} from 'borgen'
import dotenv from 'dotenv'

dotenv.config()

export const initializePayment = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { paymentMethod, phone } = req.body;

    if (!paymentMethod || paymentMethod !== 'mpesa') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Only M-Pesa via Paystack is supported for now.',
      });
    }

    if (!phone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'M-Pesa phone number is required.',
      });
    }

    const user = await User.findById(userId).populate({
      path: 'cart.product',
      select: 'price name',
    });

    if (!user || user.cart.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Cart is empty or user not found.',
      });
    }

    const totalCost = user.cart.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: totalCost * 100, // Paystack expects amount in kobo
        metadata: {
          custom_fields: [
            {
              display_name: 'M-Pesa Number',
              variable_name: 'mpesa_number',
              value: phone,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { authorization_url } = response.data.data;

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Payment initialized',
      data: {
        paymentUrl: authorization_url,
      },
    });
  } catch (error) {
    console.log(error)
    Logger.error({message: error.message});

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Payment initialization failed',
      data:null
    });
  }
};






export const paystackWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY

  try {
    
    // Verify signature
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex')

    if (hash == req.headers['x-paystack-signature']) {
       const event = req.body
    

    if (event.event.split('.')[0] === "charge.success") {
      const email = event.data?.customer?.email
      if (!email) return res.status(StatusCodes.BAD_REQUEST).send('Missing email')

      const user = await User.findOne({ email }).populate('cart.product')
      if (!user) return res.status(StatusCodes.NOT_FOUND).send('User not found')

      const totalCost = user.cart.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0)

      user.balance -= totalCost
      user.cart = []
      await user.save()

      Logger.info(`✅ Payment for ${email} succeeded. Cart cleared.`)
      return res.status(StatusCodes.OK).json({
        status:'success',
        message:'Payment completed successfully',
        data:null
      })
    }
    }

   

    
      return res.sendStatus(StatusCodes.OK)
      
  } catch (error) {
    Logger.error({ message: error.message })
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status:'error',
      message:'An error occured while running webhook',
      data:null
    })
  }
}




