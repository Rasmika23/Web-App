import express from "express"
import { loginUser } from "../controllers/userController.js"
import { registerUser } from "../controllers/userController.js"


const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

export default userRouter;