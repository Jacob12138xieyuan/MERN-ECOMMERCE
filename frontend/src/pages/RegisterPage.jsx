import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { register } from '../redux_store/loginStatusSlice';

const RegisterPage = (props) => {
	const dispatch = useDispatch();

	const redirect = props.location.search
		? props.location.search.split('=')[1]
		: '';

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { loading, error, userInfo } = useSelector(
		(state) => state.loginStatus
	);

	// if logged in, redirect to '/'
	useEffect(() => {
		if (userInfo) props.history.push(redirect);
	}, [props.history, redirect, userInfo]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(register(name, email, password, confirmPassword));
	};

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{error && <Message variant='danger'>{error}</Message>}
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='name' className='py-2'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='email' className='py-2'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='password' className='py-2'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='confirmPassword' className='py-2'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Confirm password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Button type='submit' variant='primary'>
					{loading ? <Spinner animation='border' /> : 'Sign Up'}
				</Button>
			</Form>
			<Row className='py-3'>
				<Col>
					Have an Account?{' '}
					<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
						Login
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default RegisterPage;
