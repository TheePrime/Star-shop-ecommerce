import { StatusCodes } from "http-status-codes";
import Admin from "../Models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Logger } from "borgen";
import dotenv from "dotenv";


//@desc Create an admin by superAdmin only
//@route POST /api/v1/admin/create
export const createAdmin = async (req,res)=>{
    try {

        const{name,email,password,role}= req.body
        const adminId = res.locals.id


        const currentAdminUser = await Admin.findById(adminId)
        if(!currentAdminUser){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status:'error',
                message:'Invalid admin id not allowed',
                data:null
            })
        }

        if(currentAdminUser.role != 'superAdmin'){
            return res.status()
        }
    } catch (error) {
        Logger.error({message: error.message})

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:'error',
            message:'An error occured while creating an admin',
            data:null
        })
    }
}