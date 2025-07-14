import express from "express"
import authRoute from "./routes/auth.route.js"
import cors from "cors"
import categoryRoute from "./routes/category.route.js"
import authenticate from "./middlewares/authenticate.middleware.js"
import notFoundMiddleware from "./middlewares/not-found.middleware.js"
import errorMiddleware from "./middlewares/error.middleware.js"
import productsRoute from "./routes/products.route.js"
import cartRoute from "./routes/cart.route.js"
import orderRoute from "./routes/order.route.js"
import confirmRoute from "./routes/confirm.route.js"

const app = express()

app.use(cors({
  origin : "http://localhost:5173"
}))

app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/category", authenticate, categoryRoute)
app.use("/api/products", authenticate, productsRoute)
app.use("/api/cart", authenticate, cartRoute)
app.use("/api/order", authenticate, orderRoute)
app.use("/api/confirm", confirmRoute)



app.use(notFoundMiddleware)
// app.use(errorMiddleware)



export default app
