import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
	productsActions,
	fetchProductsFromBackendAndSaveState,
} from '../redux_store/productsSlice';

const HomePage = () => {
	const dispatch = useDispatch();

	const { loading, error, products } = useSelector((state) => state.products);

	useEffect(() => {
		if (products === null) {
			dispatch(fetchProductsFromBackendAndSaveState());
		}
		return () => {
			dispatch(productsActions.setError(null));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<h1>Products</h1>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{products !== null &&
				(products.length === 0 ? (
					<Message variant='info'>No product</Message>
				) : (
					<Row>
						{products.map((product) => {
							return (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									<Product product={product} />
								</Col>
							);
						})}
					</Row>
				))}
		</>
	);
};

export default HomePage;
