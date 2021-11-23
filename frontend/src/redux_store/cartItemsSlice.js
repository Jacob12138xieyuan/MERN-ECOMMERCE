import { createSlice } from '@reduxjs/toolkit';

const cartItems = localStorage.getItem('cartItems')
	? JSON.parse(localStorage.getItem('cartItems'))
	: [];

const shippingAddress = localStorage.getItem('shippingAddress')
	? JSON.parse(localStorage.getItem('shippingAddress'))
	: { address: '', city: '', postalCode: '', country: '' };

const cartItemsSlice = createSlice({
	name: 'cartItems',
	initialState: {
		loading: false,
		error: null,
		cartItems: cartItems,
		shippingAddress: shippingAddress,
		paymentMethod: 'PayPal',
	},
	reducers: {
		// set loading
		setLoading(state, action) {
			state.loading = action.payload;
		},

		// set error
		setError(state, action) {
			state.error = action.payload;
		},

		// set cartItems
		setCartItems(state, action) {
			state.cartItems = action.payload;
			localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
		},

		// set shippingAddress
		setShippingAddress(state, action) {
			state.shippingAddress = action.payload;
			localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
		},

		// set paymentMethod
		setPaymentMethod(state, action) {
			state.paymentMethod = action.payload;
		},

		// Add new cartItem
		addCartItem(state, action) {
			const { product, qty } = action.payload;
			let found = false;
			state.cartItems.every((cartItem) => {
				if (product._id === cartItem.product._id) {
					// product exists in cartItems
					cartItem.qty += qty;
					found = true;
					return false;
				} else {
					return true;
				}
			});
			if (!found) {
				const { _id, name, image, price, countInStock } = product;
				const filteredProduct = { _id, name, image, price, countInStock };
				state.cartItems = [
					{ product: filteredProduct, qty, isValid: true },
					...state.cartItems,
				];
			}

			localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
		},

		// Delete a cartItem
		deleteCartItem(state, action) {
			state.cartItems = state.cartItems.filter(
				(cartItem) => cartItem.product._id !== action.payload
			);

			localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
		},

		// Change cartItem qty
		changeCartItemQty(state, action) {
			const { productId, qty } = action.payload;
			state.cartItems.every((cartItem) => {
				if (productId === cartItem.product._id) {
					// product exists in cartItems
					cartItem.qty = qty;
					return false;
				} else {
					return true;
				}
			});

			localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
		},

		// Change cartItem isValid
		changeCartItemIsValid(state, action) {
			const { productId, isValid } = action.payload;
			state.cartItems.every((cartItem) => {
				if (productId === cartItem.product._id) {
					// product exists in cartItems
					cartItem.isValid = isValid;
					return false;
				} else {
					return true;
				}
			});

			localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
		},
	},
});

export const cartItemsActions = cartItemsSlice.actions;
export default cartItemsSlice;
