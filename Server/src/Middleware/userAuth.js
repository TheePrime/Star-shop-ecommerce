import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import { StatusCodes } from "http-status-codes";
import {Logger} from 'borgen'
import dotenv from "dotenv";

dotenv.config();

export const userAuth = async (req, res,next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Token not provided",
        data: null,
      });
    }

    //Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "You are not allowed to perform this function.",
        data: null,
      });
    }

    res.locals.userId = user.id;

    next();
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "You are not allowed to perform this function",
    });
  }
};
