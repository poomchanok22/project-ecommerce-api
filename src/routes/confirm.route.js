import express from "express"
import * as orderController from "../controllers/order.controller.js"

const confirmRoute = express.Router()

confirmRoute.get("/", orderController.confirmPayment)





export default confirmRoute