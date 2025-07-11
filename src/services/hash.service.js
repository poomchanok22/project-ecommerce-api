import bcrypt from "bcryptjs";

const hashService = {}

//register
hashService.hashPassword = (password) =>{
  return bcrypt.hashSync(password,10)
}

//login
hashService.comparePassword = (password,hash) =>{
  return bcrypt.compareSync(password, hash)
}

export default hashService;