import { object, string, number, ref } from "yup";
import createError from "../utils/create-error.util.js";

export const loginSchema = object({
  email: string().email("Invalid email format").required("Email is required"),
  password: string().min(4, "Password must be at least 4 characters").required("Password is required")
}).noUnknown();

export const registerSchema = object({
  email: string()
    .email("Invalid email format")
    .required("Email is required"),

  name: string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),

  age: number()
    .min(20, "Age must be at least 20")
    .max(100, "Age must be at most 100")
    .required("Age is required"),

  password: string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),

  confirmPassword: string()
    .oneOf([ref('password')], "Passwords must match")
    .required("Confirm Password is required")
}).noUnknown();


export const validate =(schema, options ={}) =>{
  return async function (req, res, next){
    try {
      const cleanBody = await schema.validate(req.body, {
        abortEarly: false,
        ...options
      })
      req.body = cleanBody
      next()
    } catch(err) {
      let errMsg = err.errors.join("|||")
      console.log(errMsg)
      createError(400, errMsg)
    }
  }
}