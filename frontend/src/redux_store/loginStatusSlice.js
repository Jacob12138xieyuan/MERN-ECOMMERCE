import { createSlice } from '@reduxjs/toolkit';
import { ordersActions } from './ordersSlice';
import axios from 'axios';

const userInfo = localStorage.getItem('userInfo')
	? JSON.parse(localStorage.getItem('userInfo'))
	: null;

const loginStatusSlice = createSlice({
	name: 'loginStatus',
	initialState: {
		loading: false,
		success: null,
		error: null,
		userInfo: userInfo,
		userDetail: null,
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

		// set userInfo
		setUserInfo(state, action) {
			state.userInfo = action.payload;
			localStorage.setItem('userInfo', JSON.stringify(action.payload));
		},

		// set userInfo
		setUserDetail(state, action) {
			state.userDetail = action.payload;
		},

		// get state
	},
});

// Custom action creator
// Login
export const login = (email, password) => async (dispatch) => {
	dispatch(loginStatusActions.setLoading(true));

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const { data } = await axios.post(
			process.env.REACT_APP_API_URL + '/api/users/login',
			{ email, password },
			config
		);
		dispatch(loginStatusActions.setError(null));
		dispatch(loginStatusActions.setUserInfo(data));
		localStorage.setItem('userInfo', JSON.stringify(data));
		dispatch(loginStatusActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(loginStatusActions.setError(error));
		dispatch(loginStatusActions.setLoading(false));
	}
};

// Logout
export const logout = () => (dispatch) => {
	localStorage.removeItem('userInfo');
	localStorage.removeItem('__paypal_storage__');
	dispatch(loginStatusActions.setUserInfo(null));
	dispatch(loginStatusActions.setUserDetail(null));
	dispatch(ordersActions.setOrder(null));
	dispatch(ordersActions.setOrders(null));
};

// sign up account && login
export const register =
	(name, email, password, confirmPassword) => async (dispatch) => {
		dispatch(loginStatusActions.setLoading(true));
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const { data } = await axios.post(
				process.env.REACT_APP_API_URL + '/api/users',
				{ name, email, password, confirmPassword },
				config
			);
			dispatch(loginStatusActions.setError(null));
			dispatch(loginStatusActions.setUserInfo(data));
			localStorage.setItem('userInfo', JSON.stringify(data));
			dispatch(loginStatusActions.setLoading(false));
		} catch (e) {
			const error =
				e.response && e.response.data.message
					? e.response.data.message
					: e.message;
			dispatch(loginStatusActions.setError(error));
			dispatch(loginStatusActions.setLoading(false));
		}
	};

// get user profile
export const getUserProfile = (token) => async (dispatch) => {
	dispatch(loginStatusActions.setLoading(true));
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + '/api/users/profile',
			config
		);
		dispatch(loginStatusActions.setError(null));
		dispatch(loginStatusActions.setUserDetail(data));
		dispatch(loginStatusActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(loginStatusActions.setError(error));
		dispatch(loginStatusActions.setLoading(false));
	}
};

// update user profile
export const updateUserProfile =
	(token, name, email, password, confirmPassword, image) =>
	async (dispatch) => {
		dispatch(loginStatusActions.setLoading(true));
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await axios.put(
				process.env.REACT_APP_API_URL + '/api/users/profile',
				{ name, email, password, confirmPassword, image },
				config
			);
			dispatch(loginStatusActions.setError(null));
			dispatch(loginStatusActions.setSuccess('Update successfully'));
			dispatch(loginStatusActions.setUserDetail(data));
			dispatch(loginStatusActions.setLoading(false));
		} catch (e) {
			const error =
				e.response && e.response.data.message
					? e.response.data.message
					: e.message;
			dispatch(loginStatusActions.setError(error));
			dispatch(loginStatusActions.setLoading(false));
		}
	};

export const loginStatusActions = loginStatusSlice.actions;
export default loginStatusSlice;
