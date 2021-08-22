import { Router } from 'express';
import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/product.controller';

const router: Router = Router();

router.get('/', getAllProducts);

router.post('/new', createNewProduct);

router.get('/:productId', getProductById);

router.put('/:productId', updateProductById);

router.delete('/:productId', deleteProductById);

export default router;
