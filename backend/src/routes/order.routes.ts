import { Router } from 'express';
import {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getLoggedInUsersOrders,
  getSingleOrder,
  updateOrder,
} from '../controllers/order.controller';
import authorizeRoles from '../middlewares/authorizeRoles';
import checkAuth from '../middlewares/checkAuth';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.post('/new', AsyncErrorHandler(checkAuth), AsyncErrorHandler(createNewOrder));

router.get('/me', AsyncErrorHandler(checkAuth), AsyncErrorHandler(getLoggedInUsersOrders));

router.route('/:orderId').get(AsyncErrorHandler(getSingleOrder));

// ADMIN ROUTES
router.get(
  '/admin/',
  AsyncErrorHandler(checkAuth),
  AsyncErrorHandler(authorizeRoles('admin')),
  AsyncErrorHandler(getAllOrders)
);

router.put(
  '/admin/:orderId',
  AsyncErrorHandler(checkAuth),
  AsyncErrorHandler(authorizeRoles('admin')),
  AsyncErrorHandler(updateOrder)
);

router.delete(
  '/admin/:orderId',
  AsyncErrorHandler(checkAuth),
  AsyncErrorHandler(authorizeRoles('admin')),
  AsyncErrorHandler(deleteOrder)
);
export default router;
