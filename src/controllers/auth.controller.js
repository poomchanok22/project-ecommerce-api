import authService from "../services/auth.service.js";
import hashService from "../services/hash.service.js";
import jwtService from "../services/jwt.service.js";
import createError from "../utils/create-error.util.js";

export async function register(req, res, next) {
  const {email, name, age, password} = req.body

  const foundUser = await authService.findUserByEmail(email)
  if (foundUser) {
    createError(400,"Already in use")
  }
  if(age < 20){
    createError(400,"You must be at least 20 years old to register")
  }

  const hashPassword = hashService.hashPassword(password)

  const newUser = {
    email,
    name,
    age,
    password: hashPassword
  }

  const result = await authService.createUser(newUser)

  res.status(201).json({
    message: "Register Successfully",
    result
  });
}

export async function login(req, res, next) {
  const {email, password} = req.body

  const foundUser = await authService.findUserByEmail(email)
  if(!foundUser) {
    createError(400, "Invalid Email")
  }

  const isMatchPassword = hashService.comparePassword(password, foundUser.password)

  if(!isMatchPassword) {
    createError(400, "Invalid Password")
  }

  const payload = {id: foundUser.id}

  const accessToken = jwtService.genAccessToken(payload)

  const {password : pw, age, ...userData} = foundUser

  res.json({
    message: "Login Successfully",
    accessToken,
    user: userData

  });
}
