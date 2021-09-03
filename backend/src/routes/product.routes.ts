import { Router } from 'express';
import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/product.controller';
import authorizeRoles from '../middlewares/authorizeRoles';
import checkAuth from '../middlewares/checkAuth';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.get('/', AsyncErrorHandler(getAllProducts));

router.post(
  '/new',
  AsyncErrorHandler(checkAuth),
  AsyncErrorHandler(authorizeRoles('admin')),
  AsyncErrorHandler(createNewProduct)
);

// Best practices
router
  .route('/:productId')
  .get(AsyncErrorHandler(getProductById))
  .put(AsyncErrorHandler(updateProductById))
  .delete(AsyncErrorHandler(deleteProductById));

export default router;
