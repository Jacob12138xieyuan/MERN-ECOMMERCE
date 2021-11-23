import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({});
	res.json(products);
});

// @desc fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc Delete a user
// @route Delete /api/users/:id
// @access Private/Admin
const deleteProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		await product.remove();
		res.json({ message: 'Product deleted' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

export { getProducts, getProductById, deleteProductById };
