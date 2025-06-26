import { Router } from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserInfo,
  updateUserById,
  updateUserPassword,
  userLogin,
} from "../../Controllers/userController.js";
import { userAuth } from "../../Middleware/userAuth.js";


const router = Router();

router.post("/signup", createUser);
router.post("/login", userLogin);
router.get("/all", userAuth, getAllUsers);
router.get("/info", userAuth, getUserInfo);
router.put("/update", userAuth, updateUserById);
router.put("/password", userAuth, updateUserPassword);
router.delete("/delete", userAuth, deleteUserById);

export default router;
