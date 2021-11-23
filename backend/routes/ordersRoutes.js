import express from 'express';
const router = express.Router();
import {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	getUserOrders,
	getAllOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router
	.route('/')
	.post(protect, addOrderItems)
	.get(protect, admin, getAllOrders);
router.route('/my-orders').get(protect, getUserOrders); //must be above /:id
router.route('/:id').get(protect, getOrderById);
// .put(protect, updateUserProfile);
router.route('/:id/paid').put(protect, updateOrderToPaid);

export default router;
