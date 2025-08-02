import express from "express"
import { loginUser } from "../controllers/userController.js"
import { registerUser } from "../controllers/userController.js"
import { forgotPassword } from "../controllers/userController.js";
import { resetPassword } from "../controllers/userController.js";



const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/forgot-password",forgotPassword);
userRouter.post("/reset-password",resetPassword);

export default userRouter;