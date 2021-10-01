import { NextFunction, Response } from 'express';
import { newRequest } from '../interfaces';
import Order from '../model/order.model';
import createError from 'http-errors';
import Product from '../model/product.model';
import { ObjectId } from 'mongoose';
export const createNewOrder = async (req: newRequest, res: Response, next: NextFunction) => {
  const { orderItems, shippingInfo, itemsPrice, paymentInfo, taxPrice, shippingPrice, totalPrice } =
    req.body;

  const userId = req.user?.id;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    paymentInfo,
    taxPrice,
    shippingPrice,
    totalPrice,
    userId,
    paidAt: Date.now(),
  });

  res.status(201).json({ success: true, message: 'Order Created', order });
};

export const getSingleOrder = async (req: newRequest, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new createError.NotFound("Couldn't find the order");
  }

  res.status(200).json({ success: true, message: 'Order details', order });
};

export const getLoggedInUsersOrders = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
  const orders = await Order.find({ userId: req.user?.id });

  if (orders.length < 1) {
    throw new createError.NotFound('No Orders Found');
  }

  const responseObject = {
    success: true,
    message: 'All Orders',
    count: orders.length,
    orders: orders.map(
      ({
        shippingInfo,
        userId,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        id,
        orderStatus,
        paidAt,
        createdAt,
      }) => {
        return {
          shippingInfo,
          userId,
          orderItems,
          paymentInfo,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          id,
          orderStatus,
          paidAt,
          createdAt,
          request: {
            type: 'GET',
            message: 'Get single order',
            url: `https://localhost:4000/api/v1/orders/${id}`,
          },
        };
      }
    ),
  };

  res.status(200).json(responseObject);
};

export const getAllOrders = async (req: newRequest, res: Response, next: NextFunction) => {
  const orders = await Order.find({});

  if (orders.length < 1) {
    throw new createError.NotFound('No Orders Found');
  }

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({ success: true, message: 'all orders', totalAmount, orders });
};

const updateStock = async (id: ObjectId, quantity: number) => {
  const product = await Product.findById(id);

  product!.stock = product!.stock - quantity;

  await product!.save();
};

export const updateOrder = async (req: newRequest, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.orderId);

  if (order?.orderStatus === 'delivered') {
    throw new createError.BadRequest('Order is already delivered');
  }

  // update the stock
  order?.orderItems.forEach(async (item) => {
    await updateStock(item.productId, Number(item.quantity));
  });

  order!.orderStatus = req.body.status;
  order!.deliveredAt = new Date(Date.now());

  await order?.save();

  res.status(200).json({ success: true, message: 'Order Updated' });
};

export const deleteOrder = async (req: newRequest, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new createError.NotFound('Order Not Found');
  }

  await order.remove();

  res.status(200).json({ success: true, message: 'Order Deleted' });
};
