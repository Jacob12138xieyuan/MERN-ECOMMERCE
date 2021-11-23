import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { cartItemsActions } from '../redux_store/cartItemsSlice';

const PaymentPage = (props) => {
	const dispatch = useDispatch();

	const { address, city, postalCode, country } = useSelector(
		(state) => state.cartItems.shippingAddress
	);

	if (!address || !city || !postalCode || !country)
		props.history.push('/shipping');

	const [paymentMethod, setPaymentMethod] = useState('PayPal');

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(cartItemsActions.setPaymentMethod(paymentMethod));
		props.history.push('/place-order');
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 />
			<FormContainer>
				<h1>Payment Method</h1>
				<Form onSubmit={submitHandler}>
					<Form.Group>
						<Form.Label as='legend'>Select Payment Method</Form.Label>
						<Col>
							<Form.Check
								type='radio'
								label='PayPal or Credit Card'
								id='PayPal'
								name='paymentMethod'
								value='PayPal'
								checked={paymentMethod === 'PayPal' ? true : false}
								onChange={(e) => setPaymentMethod(e.target.value)}
							></Form.Check>
							<Form.Check
								type='radio'
								label='Stripe'
								id='Stripe'
								name='paymentMethod'
								value='Stripe'
								checked={paymentMethod === 'Stripe' ? true : false}
								onChange={(e) => setPaymentMethod(e.target.value)}
							></Form.Check>
						</Col>
					</Form.Group>
					<Button type='submit' variant='primary' className='my-2'>
						Continue
					</Button>
				</Form>
			</FormContainer>
		</>
	);
};

export default PaymentPage;
