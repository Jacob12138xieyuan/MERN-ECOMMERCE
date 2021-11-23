import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import {
	Row,
	Col,
	Image,
	ListGroup,
	ButtonGroup,
	Button,
} from 'react-bootstrap';
import { cartItemsActions } from '../redux_store/cartItemsSlice';

const CartItem = (props) => {
	const dispatch = useDispatch();

	const { product, qty: initailQty } = props.item;
	const [qty, setQty] = useState(initailQty);
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
		dispatch(
			cartItemsActions.changeCartItemQty({ productId: product._id, qty })
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qty]);

	// update isValid when qtyError changes
	useEffect(() => {
		dispatch(
			cartItemsActions.changeCartItemIsValid({
				productId: product._id,
				isValid: qtyError === null,
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product._id, qtyError]);

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

	const deleteItemHandler = () => {
		dispatch(cartItemsActions.deleteCartItem(product._id));
	};

	return (
		<div>
			<ListGroup.Item>
				<Row>
					<Col md={2}>
						<Image src={product.image} alt={product.name} fluid rounded />
					</Col>
					<Col md={3}>
						<Link to={`/product/${product._id}`}>{product.name}</Link>
					</Col>
					<Col md={2}>${product.price}</Col>
					<Col md={3}>
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
					<Col md={2}>
						<Button type='button' variant='light' onClick={deleteItemHandler}>
							<i className='fas fa-trash'></i>
						</Button>
					</Col>
				</Row>
				{qtyError && <Message variant='danger'>{qtyError}</Message>}
			</ListGroup.Item>
		</div>
	);
};

export default CartItem;
