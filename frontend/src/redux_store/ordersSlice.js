import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// const orders = [];

const ordersSlice = createSlice({
	name: 'order',
	initialState: {
		loading: false,
		success: null,
		error: null,
		order: null,
		orders: null,
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

		// set orders
		setOrder(state, action) {
			state.order = action.payload;
		},

		// set orders
		setOrders(state, action) {
			state.orders = action.payload;
		},

		// Add new order
		addOrder(state, action) {
			state.orders = [action.payload, ...state.orders];
			console.log(`${action.payload.name} order is created.`);
		},

		// Delete a order
		deleteOrder(state, action) {
			state.orders = state.orders.filter(
				(order) => order.id !== action.payload
			);
			console.log(`Order with id ${action.payload} is deleted.`);
		},

		// Change order name
		changeOrderName(state, action) {
			state.orders = state.orders.map((order) =>
				order.id === action.payload.id
					? {
							...order,
							name: action.payload.newName,
					  }
					: order
			);
			console.log(`Order with id ${action.payload.id} is edited.`);
		},

		// Toggle order finished status
		changeOrderFinished(state, action) {
			state.orders = state.orders.map((order) =>
				order.id === action.payload
					? { ...order, finished: !order.finished }
					: order
			);
			console.log(`Order with id ${action.payload} finished is changed.`);
		},
	},
});

// Custom action creator
export const fetchOrdersFromBackendAndSave = (userId) => async (dispatch) => {
	const response = await fetch(
		process.env.REACT_APP_BACKEND_URL + `/api/orders/user/${userId}`
	);
	// Retrieve raw data
	const responseData = await response.json();

	// Store orders data into redux
	if (responseData.orders)
		dispatch(ordersActions.setOrders(responseData.orders));
};

export const addOrderAndSend = (userId, cartItems) => async (dispatch) => {
	let products = [];
	cartItems.forEach((cartItem) => {
		let product = {};
		product.productId = cartItem.product.id;
		product.productNumber = cartItem.productNumber;
		products.push(product);
	});
	const newOrder = { userId, products };

	// Update backend
	try {
		await fetch(process.env.REACT_APP_BACKEND_URL + '/api/orders', {
			method: 'POST',
			body: JSON.stringify(newOrder),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.log(error);
	}
};

export const deleteOrderAndSend = (orders, orderId) => async (dispatch) => {
	const updatedOrders = orders.filter((order) => order.id !== orderId);
	// Update UI
	// dispatch(ordersActions.deleteOrder(orderId)); // REST API
	dispatch(ordersActions.setOrders(updatedOrders)); // Not REST API
	console.log(`Order with id ${orderId} is deleted.`);
	// Update backend
	try {
		await fetch(
			'https://todo-list-react-redux-9c4f9-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json',
			{
				method: 'PUT',
				body: JSON.stringify(updatedOrders),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
};

export const changeOrderNameAndSend =
	(orders, updatedOrder) => async (dispatch) => {
		const updatedOrders = orders.map((order) =>
			order.id === updatedOrder.id
				? {
						...order,
						name: updatedOrder.newName,
				  }
				: order
		);
		// Update UI
		// dispatch(ordersActions.changeOrderName(orderId)); // REST API
		dispatch(ordersActions.setOrders(updatedOrders)); // Not REST API
		console.log(`Order with id ${updatedOrder.id} is edited.`);
		// Update backend
		try {
			await fetch(
				'https://todo-list-react-redux-9c4f9-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json',
				{
					method: 'PUT',
					body: JSON.stringify(updatedOrders),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

export const changeOrderStatusAndSend =
	(orders, orderId) => async (dispatch) => {
		const updatedOrders = orders.map((order) =>
			order.id === orderId ? { ...order, finished: !order.finished } : order
		);
		// Update UI
		// dispatch(ordersActions.changeOrderFinished(orderId)); // REST API
		dispatch(ordersActions.setOrders(updatedOrders)); // Not REST API
		console.log(`Order with id ${orderId} finished is changed.`);
		// Update backend
		try {
			await fetch(
				'https://todo-list-react-redux-9c4f9-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json',
				{
					method: 'PUT',
					body: JSON.stringify(updatedOrders),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

//
export const createOrder = (token, order) => async (dispatch) => {
	dispatch(ordersActions.setLoading(true));
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.post(
			process.env.REACT_APP_API_URL + '/api/orders',
			order,
			config
		);
		dispatch(ordersActions.setOrder(data));
		dispatch(ordersActions.setError(null));
		dispatch(ordersActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(ordersActions.setError(error));
		dispatch(ordersActions.setLoading(false));
	}
};

//
export const getOrderById = (token, orderId) => async (dispatch) => {
	dispatch(ordersActions.setLoading(true));
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + `/api/orders/${orderId}`,
			config
		);
		dispatch(ordersActions.setOrder(data));
		dispatch(ordersActions.setError(null));
		dispatch(ordersActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(ordersActions.setError(error));
		dispatch(ordersActions.setLoading(false));
	}
};

//
export const getUserOrders = (token, orderId) => async (dispatch) => {
	dispatch(ordersActions.setLoading(true));
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + `/api/orders/my-orders`,
			config
		);
		dispatch(ordersActions.setOrders(data));
		dispatch(ordersActions.setError(null));
		dispatch(ordersActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(ordersActions.setError(error));
		dispatch(ordersActions.setLoading(false));
	}
};

export const updateOrderToPaid =
	(token, orderId, paymentResult) => async (dispatch) => {
		dispatch(ordersActions.setLoading(true));
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await axios.put(
				process.env.REACT_APP_API_URL + `/api/orders/${orderId}/paid`,
				paymentResult,
				config
			);
			dispatch(ordersActions.setOrder(data));
			dispatch(ordersActions.setError(null));
			dispatch(ordersActions.setLoading(false));
		} catch (e) {
			const error =
				e.response && e.response.data.message
					? e.response.data.message
					: e.message;
			dispatch(ordersActions.setError(error));
			dispatch(ordersActions.setLoading(false));
		}
	};

export const getAllOrders = (token) => async (dispatch) => {
	dispatch(ordersActions.setLoading(true));

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + '/api/orders/',
			config
		);
		dispatch(ordersActions.setError(null));
		dispatch(ordersActions.setOrders(data));
		dispatch(ordersActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(ordersActions.setError(error));
		dispatch(ordersActions.setLoading(false));
	}
};

export const ordersActions = ordersSlice.actions;
export default ordersSlice;
