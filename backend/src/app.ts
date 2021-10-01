import express, { Application, NextFunction, Request, Response } from 'express';
import connect from './db/connect';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import morgan from 'morgan';
import { responseError } from './interfaces';
import cookieParser from 'cookie-parser';
require('dotenv/config');

const app: Application = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);

// catch all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: responseError = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Express Error handler
app.use((err: responseError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    error: {
      statusCode: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
  });
});

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}/`);
  connect();
});
