import prisma from "../config/prisma.js"
import { getCategoryBy } from "../services/category.service.js"
import createError from "../utils/create-error.util.js"

export async function getAllCategory(req, res, next) {
  const categories = await prisma.category.findMany({
    orderBy: {name: "asc"}
  })

  res.json({
    message: "Succcess",
    data: categories
  })
}

export async function createCategory(req, res, next) {
  const {name} = req.body

  const existingCategory = await prisma.category.findUnique({
    where: {name : name}
  })
  // console.log("existsCategory", existingCategory)
  if(existingCategory) {
    createError(400, "This category already exist.")
  }
  
  const newCategory = await prisma.category.create({
    data: {
      name,
    created_by: req.user.id
    }
    
  })

  res.json({message: "Category created successfully",
    data: newCategory
  })
}

export async function deleteCategory(req, res, next) {
  const { id } = req.params
  const existingCategory = await prisma.category.findUnique({
    where: {category_id: parseInt(id)}
  })
  console.log(existingCategory)
  if(!existingCategory) {
    createError(400, "Category not found")
  }
console.log(existingCategory)
  await prisma.category.delete({
    where: {category_id: parseInt(id)}
  })
  res.json({message: "Category deleted successfully"})
}