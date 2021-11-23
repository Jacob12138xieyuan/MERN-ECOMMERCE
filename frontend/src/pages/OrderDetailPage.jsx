import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
	ordersActions,
	getOrderById,
	updateOrderToPaid,
} from '../redux_store/ordersSlice';

const OrderDetailPage = (props) => {
	const orderId = props.match.params.id;
	const dispatch = useDispatch();

	const [sdkReady, setSdkReady] = useState(false);

	const { token } = useSelector((state) => state.loginStatus.userInfo);
	const { loading, error, order } = useSelector((state) => state.orders);

	useEffect(() => {
		if (!order || order._id !== orderId) dispatch(getOrderById(token, orderId));
		return () => {
			dispatch(ordersActions.setError(null));
		};
	}, [dispatch, order, orderId, token]);

	useEffect(() => {
		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get(
				process.env.REACT_APP_API_URL + '/api/config/paypal'
			);
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.async = true;
			script.onload = () => {
				setSdkReady(true);
			};
			document.body.appendChild(script);
		};
		if (order && !order.isPaid) {
			if (!window.paypal) {
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [order]);

	const paymentSuccessHandler = (paymentResult) => {
		dispatch(updateOrderToPaid(token, orderId, paymentResult));
	};

	return (
		<>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{order && (
				<>
					<h1>Order {order._id}</h1>
					<Row>
						<Col md={8}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>Shipping</h2>
									<p>
										<strong>Name: </strong>
										{order.user.name}
									</p>
									<p>
										<strong>Email: </strong>
										<a href={`mailto:${order.user.email}`}>
											{order.user.email}
										</a>
									</p>
									<p>
										<strong>Shipping Address: </strong>
										{order.shippingAddress.address},{' '}
										{order.shippingAddress.city},
										{order.shippingAddress.postalCode},{' '}
										{order.shippingAddress.country}
									</p>
									{order.isDelivered ? (
										<Message variant='success'>
											Delivered on {order.deliveredAt}
										</Message>
									) : (
										<Message variant='danger'>Not Delivered</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Payment</h2>
									<p>
										<strong>Method: </strong>
										{order.paymentMethod}
									</p>
									{order.isPaid ? (
										<Message variant='success'>Paid on {order.paidAt}</Message>
									) : (
										<Message variant='danger'>Not Paid</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Order</h2>
									<strong>Items: </strong>
									{
										<ListGroup variant='flush'>
											{order.orderItems.map((item, index) => (
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
											<Col>${order.itemsPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping</Col>
											<Col>${order.shippingPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Tax</Col>
											<Col>${order.taxPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Total</Col>
											<Col>${order.totalPrice}</Col>
										</Row>
									</ListGroup.Item>
									{order && !order.isPaid && (
										<ListGroup.Item>
											{loading && <Loader />}
											{!sdkReady ? (
												<Loader />
											) : (
												<PayPalButton
													amount={order.totalPrice}
													onSuccess={paymentSuccessHandler}
												/>
											)}
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default OrderDetailPage;
