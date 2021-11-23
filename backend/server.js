import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productsRoutes from './routes/productsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	next();
});

app.get('/', (req, res) => {
	res.send('API is running...');
});

app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
	res.send(process.env.PAYPAL_CLIENT_ID)
);

// static uploads folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/backend/uploads')));

app.use(notFound);
app.use(errorHandler);

app.listen(
	process.env.PORT || 5000,
	console.log(
		`Server runing in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
	)
);
