import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import UserListPage from './pages/AdminPages/UserListPage';
import ProductListPage from './pages/AdminPages/ProductListPage';
import OrderListPage from './pages/AdminPages/OrderListPage';
import ProductEditPage from './pages/AdminPages/ProductEditPage';
import UserEditPage from './pages/AdminPages/UserEditPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
	return (
		<>
			<Header />
			<main className='py-3'>
				<Container>
					<Switch>
						<Route path='/login' exact component={LoginPage} />
						<Route path='/register' exact component={RegisterPage} />
						<Route path='/' exact component={HomePage} />
						<Route path='/product/:id' exact component={ProductPage} />
						<Route path='/cart' exact component={CartPage} />

						<ProtectedRoute path='/profile' exact component={ProfilePage} />
						<ProtectedRoute path='/shipping' exact component={ShippingPage} />
						<ProtectedRoute path='/payment' exact component={PaymentPage} />
						<ProtectedRoute
							path='/place-order'
							exact
							component={PlaceOrderPage}
						/>
						<ProtectedRoute
							path='/order/:id'
							exact
							component={OrderDetailPage}
						/>
						<ProtectedRoute path='/my-orders' exact component={OrdersPage} />

						<ProtectedAdminRoute
							path='/admin/user-list'
							exact
							component={UserListPage}
						/>
						<ProtectedAdminRoute
							path='/admin/product-list'
							exact
							component={ProductListPage}
						/>
						<ProtectedAdminRoute
							path='/admin/order-list'
							exact
							component={OrderListPage}
						/>
						<ProtectedAdminRoute
							path='/admin/product/:id/edit'
							exact
							component={ProductEditPage}
						/>
						<ProtectedAdminRoute
							path='/admin/user/:id/edit'
							exact
							component={UserEditPage}
						/>

						<Route path='*' component={NotFoundPage} />
					</Switch>
				</Container>
			</main>
			<Footer />
		</>
	);
};

export default App;
