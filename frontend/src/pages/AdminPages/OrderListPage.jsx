import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { ordersActions, getAllOrders } from '../../redux_store/ordersSlice';

const OrderListPage = () => {
	const dispatch = useDispatch();

	const { token } = useSelector((state) => state.loginStatus.userInfo);
	const { loading, error, orders } = useSelector((state) => state.orders);

	useEffect(() => {
		dispatch(getAllOrders(token));

		return () => {
			dispatch(ordersActions.setOrders(null));
		};
	}, [dispatch, token]);

	return (
		<>
			<h1>Orders</h1>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{orders && (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>USER</th>
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
								<td>{order.user.name}</td>
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

export default OrderListPage;
