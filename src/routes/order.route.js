import express from "express"
import * as orderController from "../controllers/order.controller.js"

const orderRoute = express.Router()

orderRoute.post("/", orderController.creatOrder)
orderRoute.get("/", orderController.getAllOrders)
orderRoute.get("/:order_id", orderController.getOrderById)
orderRoute.delete("/:order_id", orderController.deleteOrderById)





export default orderRoute