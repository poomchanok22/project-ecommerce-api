import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";
import stripe from "../config/stripe.js";

export const createOrderAndCheckout = async (req, res, next) => {
  const userId = req.user.id;
  const { items, total_price } = req.body;

  if (!items || items.length === 0)
    return next(createError(400, "ไม่มีสินค้าในคำสั่งซื้อ"));

  const order = await prisma.order.create({
    data: {
      user_id: userId,
      total_price: parseFloat(total_price),
      status: "PENDING",
      orderItems: {
        create: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_per_unit: item.price_per_unit,
        })),
      },
    },
  });

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "thb",
      product_data: {
        name: item.product_name,
      },
      unit_amount: Math.round(item.price_per_unit * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.order_id}`,
    cancel_url: `http://localhost:5173/payment-cancel`,
  });

  await prisma.payment.create({
    data: {
      order_id: order.order_id,
      stripePaymentId: session.id,
      sessionUrl: session.url,
      recoveryUrl: session.url,
      payment_method: "CARD",
      payment_status: "PENDING",
      amount: parseFloat(total_price),
    },
  });

  res.status(200).json({ checkoutUrl: session.url });
};

export const confirmPayment = async (req, res, next) => {
  const { session_id, order_id } = req.query;

  // console.log("ควย",req.query)

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status === "paid") {

     const order = await prisma.order.findUnique({
      where: { order_id: Number(order_id) }
    });

    if(!order){
      createError(404, "Order not found")
    }



    await prisma.payment.updateMany({
      where: { stripePaymentId: session.id },
      data: { payment_status: "PAID" },
    });

    await prisma.order.update({
      where: { order_id: Number(order_id) },
      data: { status: "PAID" },
    });

    await prisma.cart_Item.deleteMany({
      where: {
        cart: { user_id: order.user_id },
      },
    });

    return res.status(200).json({ message: "Payment confirmed" });
  }

  res.status(400).json({ message: "Payment not completed" });
};

export const retryCheckoutSession = async (req, res, next) => {
  const userId = req.user.id
  const {order_id} = req.params

  const payment = await prisma.payment.findFirst({
    where: {
      order_id: Number(order_id),
      payment_status: "PENDING"
    }
  })
  if(!payment) {
    createError(404, "ไม่พบรายการชำระเงินที่ยังไม่สำเร็จ")
  }
  res.json({url: payment.sessionUrl})
}

export const getAllOrders = async (req, res, next) => {
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: { user_id: userId },
    include: {
      orderItems: {
        include: { product: true },
      },
      payments: true,
    },
    orderBy: { oder_date: "desc" },
  });

  res.status(200).json({ orders });
};

export const getOrderById = async (req, res, next) => {
  const userId = req.user.id;
  const { order_id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      order_id: Number(order_id),
      user_id: userId,
    },
    include: {
      orderItems: {
        include: { product: true },
      },
      payments: true,
    },
  });

  if (!order) {
    createError(404, "Order not found");
  }

  res.status(200).json({ order });
};

export const deleteOrderById = async (req, res, next) => {
  const userId = req.user.id;
  const { order_id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      order_id: Number(order_id),
      user_id: userId,
    },
  });

  if (!order) {
    createError(404, "Order not found");
  }

  await prisma.order.delete({
    where: { order_id: Number(order_id) },
  });

  res.status(200).json({ message: "Order deleted successfully" });
};
