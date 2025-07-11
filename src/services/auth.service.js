import prisma from "../config/prisma.js"

const authService = {}

authService.findUserByEmail = (email)=>{
  return prisma.user.findUnique({where: {email}})
}

authService.createUser = (data)=>{
  return prisma.user.create({data})
}

export const getUserBy = async (column, value) => {
  return await prisma.user.findUnique({
    where: { [column] : value}
  })
}

export default authService;