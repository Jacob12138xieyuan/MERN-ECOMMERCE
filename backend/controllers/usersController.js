import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc Auth user, get JWT token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			isAdmin: user.isAdmin,
			image: user.image,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

// @desc Register a new user
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	const foundUser = await User.findOne({ email });
	if (!name || !email || !password) {
		res.status(400);
		throw new Error('All fields are required');
	}
	if (foundUser) {
		res.status(400);
		throw new Error('User already exists');
	}
	if (password !== confirmPassword) {
		res.status(400);
		throw new Error('Password does not match');
	}
	const user = await User.create({
		name,
		email,
		password,
	});
	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc Get user profile
// @route Get /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
	// 'protect' middleware added user into req
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			image: user.image,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
	// 'protect' middleware added user into req
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.image = req.body.image || user.image;
		if (req.body.password) {
			if (req.body.password === req.body.confirmPassword)
				user.password = req.body.password;
			else {
				res.status(400);
				throw new Error('Password does not match');
			}
		}
		const updatedUser = await user.save();
		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc Get all users
// @route Get /api/users/
// @access Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.json(users);
});

// @desc Get a user
// @route Get /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');
	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc Delete a user
// @route Delete /api/users/:id
// @access Private/Admin
const deleteUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		await user.remove();
		res.json({ message: 'User deleted' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

export {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getAllUsers,
	getUserById,
	deleteUserById,
};
