import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { login } from '../redux_store/loginStatusSlice';

const LoginPage = (props) => {
	const dispatch = useDispatch();

	const redirect = props.location.search
		? props.location.search.split('=')[1]
		: '';

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { loading, error, userInfo } = useSelector(
		(state) => state.loginStatus
	);

	// if logged in, redirect to '/'
	useEffect(() => {
		if (userInfo) props.history.push('/' + redirect);
	}, [props.history, redirect, userInfo]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
	};

	return (
		<FormContainer>
			<h1>Sign In</h1>
			{error && <Message variant='danger'>{error}</Message>}
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='email' className='my-2'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='password' className='my-2'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Button type='submit' variant='primary' className='my-2'>
					{loading ? <Spinner animation='border' /> : 'Sign In'}
				</Button>
			</Form>
			<Row className='py-3'>
				<Col>
					New Customer?{' '}
					<Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
						Register
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default LoginPage;
