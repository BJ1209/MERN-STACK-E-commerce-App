import { Router } from 'express';
import {
  addReview,
  createNewProduct,
  deleteProductById,
  deleteReview,
  getAllProducts,
  getAllReviews,
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
  .put(
    AsyncErrorHandler(checkAuth),
    AsyncErrorHandler(authorizeRoles('admin')),
    AsyncErrorHandler(updateProductById)
  )
  .delete(
    AsyncErrorHandler(checkAuth),
    AsyncErrorHandler(authorizeRoles('admin')),
    AsyncErrorHandler(deleteProductById)
  );

// Review Routes
router.get('/reviews', AsyncErrorHandler(getAllReviews));
router.put('/reviews/new', AsyncErrorHandler(checkAuth), AsyncErrorHandler(addReview));
router.delete('/reviews', AsyncErrorHandler(checkAuth), AsyncErrorHandler(deleteReview));
export default router;
