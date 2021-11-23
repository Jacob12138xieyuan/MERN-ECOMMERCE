import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const usersSlice = createSlice({
	name: 'users',
	initialState: {
		loading: false,
		success: null,
		error: null,
		users: null,
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
		setUsers(state, action) {
			state.users = action.payload;
		},

		// delete a user
		deleteUserInState(state, action) {
			state.users = state.users.filter((user) => user._id !== action.payload);
		},
	},
});

// Custom action creator
export const getAllUsers = (token) => async (dispatch) => {
	dispatch(usersActions.setLoading(true));

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + '/api/users/',
			config
		);
		dispatch(usersActions.setError(null));
		dispatch(usersActions.setUsers(data));
		dispatch(usersActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(usersActions.setError(error));
		dispatch(usersActions.setLoading(false));
	}
};

export const deleteUserById = (token, userId) => async (dispatch) => {
	dispatch(usersActions.setLoading(true));

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const { data } = await axios.delete(
			process.env.REACT_APP_API_URL + `/api/users/${userId}`,
			config
		);
		dispatch(usersActions.deleteUserInState(userId));
		dispatch(usersActions.setSuccess(data.message));
		dispatch(usersActions.setError(null));
		dispatch(usersActions.setLoading(false));
	} catch (e) {
		const error =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		dispatch(usersActions.setError(error));
		dispatch(usersActions.setLoading(false));
	}
};

export const usersActions = usersSlice.actions;
export default usersSlice;
