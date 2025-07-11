import express from "express"
import * as categoryController from "../controllers/category.controller.js"
import isAdmin from "../middlewares/isAdmin.middleware.js"


const categoryRoute = express.Router()


categoryRoute.get("/", categoryController.getAllCategory)
categoryRoute.post("/", isAdmin, categoryController.createCategory)
categoryRoute.delete("/:id", isAdmin, categoryController.deleteCategory)

export default categoryRoute