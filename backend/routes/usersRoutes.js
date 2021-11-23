import express from 'express';
const router = express.Router();
import {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getAllUsers,
	getUserById,
	deleteUserById,
} from '../controllers/usersController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, admin, getAllUsers);
router.post('/login', authUser);
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);
router
	.route('/:id')
	.get(protect, admin, getUserById)
	.delete(protect, admin, deleteUserById);

export default router;
