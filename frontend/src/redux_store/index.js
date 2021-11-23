import { configureStore } from '@reduxjs/toolkit';

// import filterOptionSlice from './filterOptionSlice';
import productsSlice from './productsSlice';
import loginStatusSlice from './loginStatusSlice';
import cartItemsSlice from './cartItemsSlice';
import ordersSlice from './ordersSlice';
import usersSlice from './usersSlice';

const store = configureStore({
	reducer: {
		products: productsSlice.reducer,
		loginStatus: loginStatusSlice.reducer,
		cartItems: cartItemsSlice.reducer,
		orders: ordersSlice.reducer,
		users: usersSlice.reducer,
	},
});

export default store;
