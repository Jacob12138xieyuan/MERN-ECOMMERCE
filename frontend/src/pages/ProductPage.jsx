import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
	Row,
	Col,
	Image,
	ListGroup,
	Card,
	Button,
	ButtonGroup,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import {
	productsActions,
	fetchProductFromBackendAndSaveState,
} from '../redux_store/productsSlice';
import { cartItemsActions } from '../redux_store/cartItemsSlice';

const ProductPage = (props) => {
	const productId = props.match.params.id;

	const dispatch = useDispatch();

	const { loading, error, product } = useSelector((state) => state.products);

	useEffect(() => {
		if (!product || product._id !== productId) {
			dispatch(fetchProductFromBackendAndSaveState(productId));
		}
		return () => {
			dispatch(productsActions.setError(null));
		};
	}, [dispatch, product, productId]);

	const [qty, setQty] = useState(1);
	const [qtyError, setQtyError] = useState(null);

	// Validate when qty changed
	useEffect(() => {
		if (qty <= 0 || qty === '' || isNaN(qty)) {
			setQtyError('Quantity not valid');
		} else if (product && qty > product.countInStock) {
			setQtyError('Exceed max stock');
		} else {
			setQtyError(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qty]);

	const decreaseNumber = (e) => {
		e.preventDefault();
		if (qty > 1) {
			setQty((prevNum) => +prevNum - 1);
		} else {
			setQty(1);
		}
	};

	const increaseNumber = (e) => {
		e.preventDefault();
		if (qty > 0) {
			setQty((prevNum) => +prevNum + 1);
		} else {
			setQty(1);
		}
	};

	const disableEnterKey = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	const qtyChangeHandler = (e) => {
		if (e.target.value === '') {
			setQty('');
		} else if (+e.target.value === 0 || isNaN(+e.target.value)) return;
		else {
			setQty(+e.target.value);
		}
	};

	const qtyFormSubmitHandler = (e) => {
		dispatch(cartItemsActions.addCartItem({ product, qty }));
		props.history.push({
			pathname: '/',
		});
	};

	return (
		<>
			<Link className='btn btn-light my-3' to='/'>
				Go Back
			</Link>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{product !== null && (
				<Row>
					<Col md={5}>
						<Image
							src={product.image}
							alt={product.name}
							fluid
							style={{ marginTop: '30px' }}
						/>
					</Col>
					<Col md={4}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{product.name}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								<Rating
									value={product.rating}
									text={`${product.numReviews} reviews`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
							<ListGroup.Item>
								Description: ${product.description}
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={3}>
						<Card style={{ marginTop: '30px' }}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<Row>
										<Col>Price:</Col>
										<Col>
											<strong>${product.price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Status:</Col>
										<Col>
											{product.countInStock > 0
												? `In Stock: ${product.countInStock}`
												: 'Out of Stock'}
										</Col>
									</Row>
								</ListGroup.Item>
								{product.countInStock > 0 && (
									<ListGroup.Item>
										<Row>
											<Col>Qty:</Col>
											<Col>
												<ButtonGroup>
													<Button
														className='btn-block change-qty-button'
														type='button'
														onClick={decreaseNumber}
													>
														-
													</Button>
													<input
														className='qty-input'
														type='text'
														onChange={qtyChangeHandler}
														value={qty}
														onKeyDown={disableEnterKey}
													/>
													<Button
														className='btn-block change-qty-button'
														type='button'
														onClick={increaseNumber}
													>
														+
													</Button>
												</ButtonGroup>
											</Col>
											{qtyError && (
												<Message variant='danger'>{qtyError}</Message>
											)}
										</Row>
									</ListGroup.Item>
								)}
								<ListGroup.Item>
									<Button
										onClick={qtyFormSubmitHandler}
										type='button'
										className='btn-block'
										style={{ width: '100%' }}
										disabled={product.countInStock === 0 || qtyError}
									>
										Add to Cart
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			)}
		</>
	);
};

export default ProductPage;
