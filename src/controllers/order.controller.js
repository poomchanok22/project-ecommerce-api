import prisma from "../config/prisma.js"
import createError from "../utils/create-error.util.js"

export const creatOrder = async (req, res, next) => {
const userId = req.user.id
const {total_price, items} = req.body

if(!items || items.length === 0) {
  createError(400, "Order must have at least one item")
}


const order = await prisma.order.create({
  data: {
    user_id: userId,
    total_price: parseFloat(total_price),
    status: "PENDING",
    orderItems: {
      create: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_per_unit: parseFloat(item.price_per_unit)
      }))
    }
  },
  include: {
    orderItems: {
      include: {product: true}
    }
  }
})
res.status(200).json({ order })
}

export const getAllOrders = async (req, res, next) => {
  const userId = req.user.id

  const orders = await prisma.order.findMany({
    where: {user_id: userId},
    include: {
      orderItems: {
        include: { product: true}
      },
      payments: true
    },
    orderBy: {oder_date: "desc"}
  })

  res.status(200).json({orders})
}

export const getOrderById = async (req, res, next) => {
  const userId = req.user.id
  const { order_id } = req.params
  
  const order = await prisma.order.findFirst({
    where: {
      order_id: Number(order_id),
      user_id: userId
    },
    include: {
      orderItems: {
        include: {product: true}
      },
      payments: true
    }
  })

  if(!order) {
    createError(404, "Order not found")
  }

  res.status(200).json({ order })
}

export const deleteOrderById = async (req, res, next) => {
  const userId = req.user.id
  const { order_id } = req.params

  const order = await prisma.order.findFirst({
    where: {
      order_id: Number(order_id),
      user_id: userId
    }
  })

  if(!order) {
    createError(404, "Order not found")
  }

  await prisma.order.delete({
    where: { order_id: Number(order_id)}
  })

  res.status(200).json({ message: "Order deleted successfully" })
}