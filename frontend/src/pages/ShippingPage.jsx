import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { cartItemsActions } from '../redux_store/cartItemsSlice';

const ShippingPage = (props) => {
	const dispatch = useDispatch();

	const {
		address: savedAddress,
		city: savedCity,
		postalCode: savedPostalCode,
		country: savedCountry,
	} = useSelector((state) => state.cartItems.shippingAddress);

	const [address, setAddress] = useState(savedAddress);
	const [city, setCity] = useState(savedCity);
	const [postalCode, setPostalCode] = useState(savedPostalCode);
	const [country, setCountry] = useState(savedCountry);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			cartItemsActions.setShippingAddress({
				address,
				city,
				postalCode,
				country,
			})
		);
		props.history.push('/payment');
	};

	return (
		<>
			<CheckoutSteps step1 step2 />
			<FormContainer>
				<h1>Shipping</h1>
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='address' className='my-2'>
						<Form.Label>Address</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter address'
							value={address}
							required
							onChange={(e) => setAddress(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='city' className='my-2'>
						<Form.Label>City</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter city'
							value={city}
							required
							onChange={(e) => setCity(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='postalCode' className='my-2'>
						<Form.Label>PostalCode</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter postalCode'
							value={postalCode}
							required
							onChange={(e) => setPostalCode(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='country' className='my-2'>
						<Form.Label>Country</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter country'
							value={country}
							required
							onChange={(e) => setCountry(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Button type='submit' variant='primary' className='my-2'>
						Continue
					</Button>
				</Form>
			</FormContainer>
		</>
	);
};

export default ShippingPage;
