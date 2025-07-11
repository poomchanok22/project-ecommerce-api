import jwt from "jsonwebtoken"

const jwtService = {}

jwtService.genAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "15d", algorithm:"HS256"})
}

jwtService.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]})
}

export default jwtService