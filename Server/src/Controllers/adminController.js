import { StatusCodes } from "http-status-codes";
import Admin from "../Models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Logger } from "borgen";
import dotenv from "dotenv";

//@desc Create an admin by superAdmin only
//@route POST /api/v1/admin/create
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = res.locals.userId;

    const currentAdminUser = await Admin.findById(userId);
    if (!currentAdminUser) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Invalid admin id!",
        data: null,
      });
    }

    if (currentAdminUser.role != "superAdmin") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "You are not allowed to perform this function",
        data: null,
      });
    }

    if (!name || !email || !password || !role) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Provide all the credentials",
        data: null,
      });
    }

    const duplicateAdmin = await Admin.findOne({ email: email });
    if (duplicateAdmin) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: "An admin with this email already exists",
        data: null,
      });
    }

    //Hash admin password
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    if (role) newAdmin.role = role;
    await newAdmin.save();

    return res.status(StatusCodes.OK).json({
      status: "error",
      message: "Admin created successfully",
      data: newAdmin,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while creating an admin",
      data: null,
    });
  }
};

//@desc Login in an admin
//@route POST /api/v1/admin/login

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Invalid email or password",
        data: null,
      });
    }

    //Compare the provided password with the hashed passowrd in database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Invalid email or password",
        data: null,
      });
    }

    //Create jwt token

    let token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Admin login successfull",
      data: {
        userId: admin._id,
        name: admin.name,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while logging in admin",
      data: null,
    });
  }
};

//@desc fetch a user's info
//@route GET /api/v1/admin/info

export const getUserInfo = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Admin not found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Admin fetched successfully",
      data: null,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while fetching an admin",
      data: null,
    });
  }
};
//@desc Fetch all admins by superAdmin only
//@route GET /api/v1/admin/all
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    return res.status(StatusCodes.OK).json({
      status: "error",
      message: "All admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while fetching all admins",
      data: null,
    });
  }
};


//@desc Update admin details by id and only superAdmin
//@route PUT /api/v1/admin/update/:id

export const updateAdminById= async (req,res)=>{
    try {
        const adminId = res.locals.userId
        const userId = req.params.id
        
        const admin = await  Admin.findById(userId)
        if(!admin){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status:'error',
                message:'Admin not found',
                data:null
            })
        }

        const currentAdminUser= await Admin.findById(adminId)
        if(currentAdminUser.role !='superAdmin'){
            return res.status()
        }
    } catch (error) {
        Logger.error({message: error.message})

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:'error',
            message:'An error occured while updating an admin',
            data:null
        })
    }
}
