import express from "express";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import * as productsController from "../controllers/products.controller.js"
import upload from "../middlewares/upload.middleware.js";

const productsRoute = express.Router()

productsRoute.get("/", productsController.getAllProducts)
productsRoute.get("/:product_id", productsController.getProductById)
productsRoute.post("/", isAdmin, upload.single('image'), productsController.createProducts)
productsRoute.patch("/:product_id", isAdmin, upload.single('image'), productsController.editProduct)
productsRoute.delete("/:product_id", isAdmin, productsController.deleteProduct)




export default productsRoute