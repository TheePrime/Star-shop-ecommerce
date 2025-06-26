import User from '../Models/user.model.js'
import Product from '../Models/product.model.js'
import {StatusCodes} from 'http-status-codes'
import {Logger} from 'borgen'
import {mongoose} from 'mongoose'


//@desc Add a product to cart
//@route POST /api/v1/cart/add

export const addProductToCart = async (req,res)=>{
    try {
        const userId = res.locals.userId
        const {quantity,productId}= req.body

        if(!productId||!quantity){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status:'error',
                message:'Provide all the required fields',
                data:null
            })
        }

        const product = await Product.findById(productId)
        if(!product){
            return res.status(StatusCodes.NOT_FOUND).json({
                status:'error',
                message:'Product not found',
                data:null
            })
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status:'error',
                message:'You are not allowed to perform this function',
                data:null
            })
        }

        //Check if product is enough in stock
        if(product.quantity < quantity){
            return res.status(StatusCodes.BAD_REQUEST).json()
        }

    } catch (error) {
        Logger.error({message})

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:'error',
            message:'An error occured while trying to add product to cart',
            data:null
        })
    }
}