import { Router } from 'express';
import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/product.controller';
import checkAuth from '../middlewares/checkAuth';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.get('/', AsyncErrorHandler(getAllProducts));

router.post('/new', AsyncErrorHandler(checkAuth), AsyncErrorHandler(createNewProduct));

router.get('/:productId', AsyncErrorHandler(getProductById));

router.put('/:productId', AsyncErrorHandler(updateProductById));

router.delete('/:productId', AsyncErrorHandler(deleteProductById));

export default router;
