import express from "express"
import * as orderController from "../controllers/order.controller.js"

const orderRoute = express.Router()

orderRoute.post("/", orderController.createOrderAndCheckout)
orderRoute.get("/retry/:order_id", orderController.retryCheckoutSession)
orderRoute.get("/", orderController.getAllOrders)
orderRoute.get("/:order_id", orderController.getOrderById)
orderRoute.patch("/:order_id", orderController.cancelOrder)





export default orderRoute