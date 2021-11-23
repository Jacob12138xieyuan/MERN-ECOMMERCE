import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import CartItem from '../components/CartItem';
import CheckoutSteps from '../components/CheckoutSteps';

const CartPage = (props) => {
	const { cartItems } = useSelector((state) => state.cartItems);
	const checkoutHandler = () => {
		props.history.push('/login?redirect=shipping');
	};
	return (
		<>
			<CheckoutSteps step1 />
			<Row>
				<Col md={8}>
					<h1>Shopping Cart</h1>
					{cartItems.length === 0 ? (
						<Message>
							Your cart is empty <Link to='/'>Go Shopping</Link>
						</Message>
					) : (
						<ListGroup variant='flush'>
							{cartItems.map((item) => (
								<CartItem key={item.product._id} item={item} />
							))}
						</ListGroup>
					)}
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>
									Subtotal {cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
									items
								</h2>
								$
								{cartItems
									.reduce((acc, item) => acc + item.qty * item.product.price, 0)
									.toFixed(2)}
							</ListGroup.Item>
							<ListGroup.Item>
								<Button
									type='button'
									className='btn-block'
									style={{ width: '100%' }}
									disabled={
										cartItems.length === 0 ||
										!cartItems.reduce((acc, item) => acc && item.isValid, true)
									}
									onClick={checkoutHandler}
								>
									Proceed to Shipping
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default CartPage;
