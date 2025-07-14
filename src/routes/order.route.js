import express from "express"
import * as orderController from "../controllers/order.controller.js"

const orderRoute = express.Router()

orderRoute.post("/", orderController.createOrderAndCheckout)
orderRoute.get("/retry/:order_id", orderController.retryCheckoutSession)
orderRoute.get("/", orderController.getAllOrders)
orderRoute.get("/:order_id", orderController.getOrderById)
orderRoute.delete("/:order_id", orderController.deleteOrderById)





export default orderRoute