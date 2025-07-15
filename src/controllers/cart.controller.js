import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";


export const addProductToCart = async (req, res, next) => {
  const {product_id, quantity} = req.body
  const userId = req.user.id
  if (!product_id || !quantity) {
    createError(400, "Product ID and quantity are required")
  }

  let cart = await prisma.cart.findFirst({
    where: {user_id: userId}
  })

  if(!cart) {
    cart = await prisma.cart.create({
      data: {user_id: userId}
    })
  }

  const existingCartItem = await prisma.cart_Item.findFirst({
    where:{
      cart_id: cart.cart_id,
      product_id: product_id
    }
  })

  if (existingCartItem) {
    await prisma.cart_Item.update({
      where:{ cart_item_id: existingCartItem.cart_item_id},
      data: { quantity: existingCartItem.quantity + quantity}
    })
  } else {
    await prisma.cart_Item.create({
      data: {
        cart_id: cart.cart_id,
        product_id,
        quantity
      }
    })
  }
  res.status(200).json({ message: "Product added to cart successfully" });
}

export const getAllProductsInCart = async (req, res, next) => {
  const userId = req.user.id

  const cart = await prisma.cart.findFirst({
    where: { user_id: userId},
    include: {
      cartItems: {
        include: {
          product: true
        }
      }
    }
  })

  if(!cart) {
   return res.status(404).json({ message: "Cart not found"})
  }

  if (!cart.cartItems || cart.cartItems.length === 0) {
   return res.status(200).json({ message : "Cart is empty", cartId: cart.cart_id, cartItems: [] })
  }

  res.status(200).json({
    message: "Cart retrieved successfully",
    cartId: cart.cart_id,
    cartItems: cart.cartItems
  })
}

export const editProductInCart = async (req, res, next) => {
  const {cart_item_id} = req.params
  const {quantity} = req.body
  const userId = req.user.id


 
  if (quantity === undefined) {
    createError(400, "Quantity is required")
  }

  const cartItem = await prisma.cart_Item.findUnique({
    where: {cart_item_id: parseInt(cart_item_id)},
    include: {
      cart: true
    }
  })

  if (!cartItem || cartItem.cart.user_id !== userId){
    createError(404,"Cart item not found")
  }

  if (quantity < 0){
    await prisma.cart_Item.delete({
      where: {cart_item_id: parseInt(cart_item_id)}
    })
    res.status(200).json({ message: "Product removed from cart"})
  }

 

  await prisma.cart_Item.update({
    where: { cart_item_id: parseInt(cart_item_id)},
    data: {quantity}
  })

  res.status(200).json({ message: "Cart item updated successfully"})
}

export const deleteProductInCart = async(req , res , next) => {
  const {cart_item_id} = req.params
  const userId = req.user.id

  const cartItem = await prisma.cart_Item.findUnique({
    where: {cart_item_id: parseInt(cart_item_id)},
    include: {cart : true}
  })

  if(!cartItem || cartItem.cart.user_id !== userId) {
    createError(404, "Cart item not found")
  }

  await prisma.cart_Item.delete({
    where: {cart_item_id: parseInt(cart_item_id)}
  })

  res.status(200).json({ message: "Product removed from cart"})
}