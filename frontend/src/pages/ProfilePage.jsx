import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import {
	loginStatusActions,
	getUserProfile,
	updateUserProfile,
} from '../redux_store/loginStatusSlice';
import Loader from '../components/Loader';

const ProfilePage = (props) => {
	const dispatch = useDispatch();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [image, setImage] = useState(''); // /backend/uploads/image-1632647470361.jpeg
	const [uploading, setUploading] = useState(false);

	const { loading, error, success, userInfo, userDetail } = useSelector(
		(state) => state.loginStatus
	);

	useEffect(() => {
		if (!userDetail) {
			dispatch(getUserProfile(userInfo.token));
		} else {
			setName(userDetail.name);
			setEmail(userDetail.email);
		}
	}, [dispatch, userDetail, userInfo.token]);

	console.log(image);
	const submitHandler = (e) => {
		e.preventDefault();
		// also update userInfo
		dispatch(loginStatusActions.setUserInfo({ ...userInfo, name, image }));
		dispatch(
			updateUserProfile(
				userInfo.token,
				name,
				email,
				password,
				confirmPassword,
				image
			)
		);
	};

	const uploadImageHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};
			const { data } = await axios.post(
				process.env.REACT_APP_API_URL + '/api/upload',
				formData,
				config
			);
			setImage(data);
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
		}
	};

	return (
		<Row>
			<Col md={6}>
				<h2>User Profile</h2>
				{(error || success) && (
					<Message variant={error ? 'danger' : 'success'}>
						{error || success}
					</Message>
				)}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name' className='my-2'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						></Form.Control>
					</Form.Group>
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
					<Form.Group controlId='confirmPassword' className='my-2'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='image' className='my-2'>
						<Form.Label>Image</Form.Label>
						<Form.File
							type='file'
							placeholder='Enter image url'
							onChange={uploadImageHandler}
						></Form.File>
						{uploading && <Loader />}
					</Form.Group>
					<Button type='submit' variant='primary' className='my-2'>
						{loading ? <Spinner animation='border' /> : 'Update'}
					</Button>
				</Form>
			</Col>
			<Col md={6}></Col>
		</Row>
	);
};

export default ProfilePage;
