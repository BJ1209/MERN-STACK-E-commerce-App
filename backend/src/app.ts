import express, { Application } from 'express';
import connect from './db/connect';
import cors from 'cors';
import productRouter from './routes/product.routes';
import morgan from 'morgan';
require('dotenv/config');

const app: Application = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.send('welcome to the shopping app - API');
});

// Routes
app.use('/api/v1/products', productRouter);

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}/`);
  connect();
});
