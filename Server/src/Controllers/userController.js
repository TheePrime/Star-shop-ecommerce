import { StatusCodes } from "http-status-codes";
import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Logger } from "borgen";
import dotenv from "dotenv";

dotenv.config();

//@desc  Create a new  user
//@route POST /api/v1/user/signup
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Please provide all the credentials",
        data: null,
      });
    }

    //Check for existing user
    const user = await User.findOne({ email });
    if (user) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: "A user with this email already exists",
        data: null,
      });
    }

    //Hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    //Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //Create jwt token
    let token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "User Signup successfull",
      data: {
        newUser,
        token,
      },
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while creating a user",
      data: null,
    });
  }
};

//@desc Login user
//@route  POST /api/v1/user/login

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Please enter all the credentials",
        data: null,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    //Compare provided password to hashedpassword

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Invalid email or password",
        data: null,
      });
    }

    //Create jwt token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    
    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "User login successfull",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while logining user",
      data: null,
    });
  }
};

//@desc Get one user info
//route GET /api/v1/user/info

export const getUserInfo = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while fetching user",
      data: null,
    });
  }
};

//@desc Get all users
//@route GET /api/v1/user/all

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while fetching all users",
      data: null,
    });
  }
};
//@desc Update user account byId
//@route PUT /api/v1/user/update

export const updateUserById = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { name, email } = req.body;

    const user = await User.findById(userId).select("-password");
    console.log(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "The user is not found",
        data: null,
      });
    }

    //Update user details
    if (name) user.name = name;
    if (email) user.email = email;

    const updatedUser = await user.save();

    return res.status(StatusCodes.OK).json({
      status: "error",
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "A problem occured while updating a user",
      data: null,
    });
  }
};

//@desc Delete user account
//@route DELETE /api/v1/user

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.locals.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "The user not  found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while deleting user account",
      data: null,
    });
  }
};
