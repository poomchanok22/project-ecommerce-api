import express from "express"
import * as authController from "../controllers/auth.controller.js"
import { loginSchema, registerSchema, validate } from "../validations/validator.js"

const authRoute = express.Router()

authRoute.post("/register", validate(registerSchema), authController.register)
authRoute.post("/login", validate(loginSchema), authController.login)

export default authRoute