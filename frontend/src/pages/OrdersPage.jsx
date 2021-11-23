import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getUserOrders } from '../redux_store/ordersSlice';

const OrdersPage = () => {
	const dispatch = useDispatch();
	const {
		loading: orderLoading,
		orderError,
		orders,
	} = useSelector((state) => state.orders);
	const { token } = useSelector((state) => state.loginStatus.userInfo);

	useEffect(() => {
		if (!orders) {
			dispatch(getUserOrders(token));
		}
	}, [dispatch, orders, token]);

	return (
		<>
			<h2>My Orders</h2>
			{orderError && <Message variant='danger'>{orderError}</Message>}
			{orderLoading && <Loader />}
			{orders && (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>
									<Link to={`/order/${order._id}`}>{order._id}</Link>
								</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>{order.totalPrice}</td>
								<td>
									{order.isPaid ? (
										order.paidAt.substring(0, 10)
									) : (
										<i className='fas fa-times' style={{ color: 'red' }} />
									)}
								</td>
								<td>
									{order.isDelivered ? (
										order.deliveredAt.substring(0, 10)
									) : (
										<i className='fas fa-times' style={{ color: 'red' }} />
									)}
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default OrdersPage;
