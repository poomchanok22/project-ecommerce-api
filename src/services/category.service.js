import prisma from "../config/prisma.js";

export const getCategoryBy = async (column, value) => {
  return await prisma.category.findUnique({
    where: {[column] : value}
  })
}

export const createCategorys = async(categoryData) => {
  return await prisma.category.create({data: categoryData})
}