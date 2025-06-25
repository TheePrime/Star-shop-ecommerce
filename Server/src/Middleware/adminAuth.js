import jwt from "jsonwebtoken";
import Admin from "../Models/admin.model.js";
import { StatusCodes } from "http-status-codes";
import {Logger} from 'borgen'
import dotenv from "dotenv";

dotenv.config();

export const adminAuth = async (req, res,next) => {
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

    let admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "You are not allowed to perform this function.",
        data: null,
      });
    }

    res.locals.userId = admin.id;

    next();
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "You are not allowed to perform this function",
    });
  }
};
