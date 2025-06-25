import { Router } from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
  userLogin,
} from "../../Controllers/userController.js";
import { userAuth } from "../../Middleware/userAuth.js";

const router = Router();

router.post("/signup", createUser);
router.post("/login", userLogin);
router.get("/all", userAuth, getAllUsers);
router.get("/:id", userAuth, getUserById);

router.put("/update", userAuth, updateUserById);
router.delete("/delete/:id", userAuth, deleteUserById);

export default router;
