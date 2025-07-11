import express from "express"
import * as cartController from  "../controllers/cart.controller.js"

const cartRoute = express.Router()

cartRoute.post("/", cartController.addProductToCart)
cartRoute.get("/", cartController.getAllProductsInCart)
cartRoute.patch("/:cart_item_id", cartController.editProductInCart)
cartRoute.delete("/:cart_item_id" , cartController.deleteProductInCart)


export default cartRoute