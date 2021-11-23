import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const productsSlice = createSlice({
	name: 'products',
	initialState: {
		loading: false,
		success: null,
		error: null,
		product: null,
		products: null,
	},
	reducers: {
		// set loading
		setLoading(state, action) {
			state.loading = action.payload;
		},

		// set success
		setSuccess(state, action) {
			state.success = action.payload;
		},

		// set error
		setError(state, action) {
			state.error = action.payload;
		},

		// set product
		setProduct(state, action) {
			state.product = action.payload;
		},

		// set products
		setProducts(state, action) {
			state.products = action.payload;
		},

		// Add new product to state
		// addProduct(state, action) {
		// 	state.products = [action.payload, ...state.products];
		// 	console.log(`${action.payload.name} product is created.`);
		// },

		// delete a product
		deleteProductInState(state, action) {
			state.products = state.products.filter(
				(product) => product._id !== action.payload
			);
		},

		// Change product name
		// changeProductName(state, action) {
		// 	state.products = state.products.map((product) =>
		// 		product._id === action.payload.id
		// 			? {
		// 					...product,
		// 					name: action.payload.newName,
		// 			  }
		// 			: product
		// 	);
		// 	console.log(`Product with id ${action.payload.id} is edited.`);
		// },
	},
});

// Custom action creator
export const fetchProductsFromBackendAndSaveState = () => async (dispatch) => {
	dispatch(productsActions.setLoading(true));
	try {
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + '/api/products'
		);
		dispatch(productsActions.setProducts(data));
		dispatch(productsActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(productsActions.setError(error));
		dispatch(productsActions.setLoading(false));
	}
};

export const fetchProductFromBackendAndSaveState = (id) => async (dispatch) => {
	dispatch(productsActions.setLoading(true));
	try {
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + `/api/products/${id}`
		);
		dispatch(productsActions.setProduct(data));
		dispatch(productsActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(productsActions.setError(error));
		dispatch(productsActions.setLoading(false));
	}
};

export const deleteProductById = (token, productId) => async (dispatch) => {
	dispatch(productsActions.setLoading(true));

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.delete(
			process.env.REACT_APP_API_URL + `/api/products/${productId}`,
			config
		);
		dispatch(productsActions.deleteProductInState(productId));
		dispatch(productsActions.setSuccess(data.message));
		dispatch(productsActions.setError(null));
		dispatch(productsActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(productsActions.setError(error));
		dispatch(productsActions.setLoading(false));
	}
};

// export const addProductAndSend = (newProduct) => async (dispatch) => {
// 	// Create new product object
// 	const product = {
// 		id: uuidv4(),
// 		// Name and finished
// 		...newProduct,
// 		dateTime: new Date().toLocaleString(),
// 	};

// 	// Update UI
// 	dispatch(productsActions.addProduct(product));
// 	// Update backend
// 	try {
// 		await fetch(
// 			'https://todo-list-react-redux-9c4f9-default-rtdb.asia-southeast1.firebasedatabase.app/products.json',
// 			{
// 				method: 'POST',
// 				body: JSON.stringify(product),
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 			}
// 		);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// export const deleteProductAndSend =
// 	(products, productId) => async (dispatch) => {
// 		const updatedProducts = products.filter(
// 			(product) => product._id !== productId
// 		);
// 		// Update UI
// 		// dispatch(productsActions.deleteProduct(productId)); // REST API
// 		dispatch(productsActions.setProducts(updatedProducts)); // Not REST API
// 		console.log(`Product with id ${productId} is deleted.`);
// 		// Update backend
// 		try {
// 			await fetch(
// 				'https://todo-list-react-redux-9c4f9-default-rtdb.asia-southeast1.firebasedatabase.app/products.json',
// 				{
// 					method: 'PUT',
// 					body: JSON.stringify(updatedProducts),
// 					headers: {
// 						'Content-Type': 'application/json',
// 					},
// 				}
// 			);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};

// export const changeProductNameAndSend =
// 	(products, updatedProduct) => async (dispatch) => {
// 		const updatedProducts = products.map((product) =>
// 			product._id === updatedProduct._id
// 				? {
// 						...product,
// 						name: updatedProduct.newName,
// 				  }
// 				: product
// 		);
// 		// Update UI
// 		// dispatch(productsActions.changeProductName(productId)); // REST API
// 		dispatch(productsActions.setProducts(updatedProducts)); // Not REST API
// 		console.log(`Product with id ${updatedProduct._id} is edited.`);
// 		// Update backend
// 		try {
// 			await fetch(
// 				'https://todo-list-react-redux-9c4f9-default-rtdb.asia-southeast1.firebasedatabase.app/products.json',
// 				{
// 					method: 'PUT',
// 					body: JSON.stringify(updatedProducts),
// 					headers: {
// 						'Content-Type': 'application/json',
// 					},
// 				}
// 			);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};

// export const changeProductFinishedAndSend =
// 	(products, productId) => async (dispatch) => {
// 		const updatedProducts = products.map((product) =>
// 			product._id === productId
// 				? { ...product, finished: !product.finished }
// 				: product
// 		);
// 		// Update UI
// 		// dispatch(productsActions.changeProductFinished(productId)); // REST API
// 		dispatch(productsActions.setProducts(updatedProducts)); // Not REST API
// 		console.log(`Product with id ${productId} finished is changed.`);
// 		// Update backend
// 		try {
// 			await fetch(
// 				'https://todo-list-react-redux-9c4f9-default-rtdb.asia-southeast1.firebasedatabase.app/products.json',
// 				{
// 					method: 'PUT',
// 					body: JSON.stringify(updatedProducts),
// 					headers: {
// 						'Content-Type': 'application/json',
// 					},
// 				}
// 			);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};

export const productsActions = productsSlice.actions;
export default productsSlice;
