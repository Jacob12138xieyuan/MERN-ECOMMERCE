import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Rating from '../../components/Rating';
import {
	productsActions,
	fetchProductsFromBackendAndSaveState,
	deleteProductById,
} from '../../redux_store/productsSlice';

const ProductListPage = () => {
	const dispatch = useDispatch();

	const { token } = useSelector((state) => state.loginStatus.userInfo);
	const { loading, success, error, products } = useSelector(
		(state) => state.products
	);

	useEffect(() => {
		if (products === null) {
			dispatch(fetchProductsFromBackendAndSaveState());
		}
		return () => {
			dispatch(productsActions.setError(null));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteHandler = (productId) => {
		if (window.confirm('Are you sure?')) {
			dispatch(deleteProductById(token, productId));
		}
	};

	return (
		<>
			<h1>Products</h1>
			{loading && <Loader />}
			{success && <Message variant='success'>{success}</Message>}
			{error && <Message variant='danger'>{error}</Message>}
			{products && (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>NAME</th>
							<th>IMAGE</th>
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>STOCK</th>
							<th>RATING</th>
							<th>MANAGE</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>{product.name}</td>
								<td>
									<Image
										src={product.image}
										alt={product.name}
										fluid
										rounded
										style={{ width: '100px', height: '100px' }}
									/>
								</td>
								<td>${product.price}</td>
								<td>{product.category}</td>
								<td>{product.countInStock}</td>
								<td>
									<Rating value={product.rating} text={``} />
								</td>

								<td>
									<Link to={`/admin/product/${product._id}/edit`}>
										<Button variant='light' className='btn-sm'>
											<i className='fas fa-edit'></i>
										</Button>
									</Link>
									<Button
										variant='danger'
										className='btn-sm'
										onClick={() => deleteHandler(product._id)}
									>
										<i className='fas fa-trash'></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default ProductListPage;
