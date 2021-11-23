import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Row,
	Col,
	ListGroup,
	Image,
	Card,
	Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../redux_store/ordersSlice';
import { cartItemsActions } from '../redux_store/cartItemsSlice';

const PlaceOrderPage = (props) => {
	const dispatch = useDispatch();

	const { cartItems, shippingAddress, paymentMethod } = useSelector(
		(state) => state.cartItems
	);
	const { token } = useSelector((state) => state.loginStatus.userInfo);
	const { loading, error, order } = useSelector((state) => state.orders);

	const toTwoDecimal = (number) => {
		return Number.parseFloat(number).toFixed(2);
	};
	const itemsPrice = toTwoDecimal(
		cartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0)
	);
	const shippingPrice = toTwoDecimal(itemsPrice > 80 ? 0 : 10);
	const taxRate = 0.15;
	const taxPrice = toTwoDecimal(itemsPrice * taxRate);
	const totalPrice = toTwoDecimal(+itemsPrice + +shippingPrice + +taxPrice);

	useEffect(() => {
		if (order) {
			props.history.push(`/order/${order._id}`);
			dispatch(cartItemsActions.setCartItems([]));
		}
	}, [props.history, order, dispatch]);

	const placeOrderHandler = () => {
		dispatch(
			createOrder(token, {
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			})
		);
	};
	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Shipping Address: </strong>
								{shippingAddress.address}, {shippingAddress.city},
								{shippingAddress.postalCode}, {shippingAddress.country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment</h2>
							<strong>Method: </strong>
							{paymentMethod}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order</h2>
							<strong>Items: </strong>
							{
								<ListGroup variant='flush'>
									{cartItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={2}>
													<Image
														src={item.product.image}
														alt={item.product.name}
														fluid
														rounded
													/>
												</Col>
												<Col md={6}>
													<Link to={`/product/${item.product._id}`}>
														{item.product.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.product.price} = $
													{item.qty * item.product.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax ({taxRate * 100}%)</Col>
									<Col>${taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${totalPrice}</Col>
								</Row>
							</ListGroup.Item>

							{error && (
								<ListGroup.Item>
									<Message variant='danger'>{error}</Message>
								</ListGroup.Item>
							)}

							<ListGroup.Item>
								<Button
									type='button'
									className='btn-block'
									style={{ width: '100%' }}
									disabled={cartItems.length === 0}
									onClick={placeOrderHandler}
								>
									{loading ? <Spinner animation='border' /> : 'Place Order'}
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderPage;
