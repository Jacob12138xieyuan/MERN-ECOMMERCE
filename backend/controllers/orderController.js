import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	} = req.body;
	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No order items');
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
		});
		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	}
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
	const foundOrder = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	);
	if (foundOrder) {
		if (req.user._id.toString() === foundOrder.user._id.toString())
			res.json(foundOrder);
		else {
			res.status(401);
			throw new Error('Not authorised');
		}
	} else {
		res.status(404);
		throw new Error('Order Not Found');
	}
});

// @desc Update order paid
// @route PUT /api/orders/:id/paid
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const foundOrder = await Order.findById(req.params.id);

	if (foundOrder) {
		if (req.user._id.toString() === foundOrder.user._id.toString()) {
			foundOrder.isPaid = true;
			foundOrder.paidAt = Date.now();
			foundOrder.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.payer.email_address,
			};
			const updatedOrder = await foundOrder.save();
			res.json(updatedOrder);
		} else {
			res.status(401);
			throw new Error('Not authorised');
		}
	} else {
		res.status(404);
		throw new Error('Order Not Found');
	}
});

// @desc Get user orders
// @route GET /api/orders/my-orders
// @access Private
const getUserOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.json(orders);
});

// @desc Get all orders
// @route Get /api/orders/
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate('user', 'name');
	res.json(orders);
});

export {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	getUserOrders,
	getAllOrders,
};
