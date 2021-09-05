import { Router } from 'express';
import {
  deleteUserById,
  forgotPasswordHandler,
  getAllUsers,
  getUserById,
  getUserProfile,
  loginHandler,
  logoutHandler,
  newUser,
  updatePasswordHandler,
  updateUserById,
  verifyResetTokenHandler,
} from '../controllers/user.controller';
import authorizeRoles from '../middlewares/authorizeRoles';
import checkAuth from '../middlewares/checkAuth';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.post('/new', AsyncErrorHandler(newUser));
router.post('/login', AsyncErrorHandler(loginHandler));
router.post('/forgot-password', AsyncErrorHandler(forgotPasswordHandler));
router.post('/reset/:resetToken', AsyncErrorHandler(verifyResetTokenHandler));
router.get('/logout', AsyncErrorHandler(logoutHandler));

router.get('/me', AsyncErrorHandler(checkAuth), AsyncErrorHandler(getUserProfile));
router.post(
  '/update-password',
  AsyncErrorHandler(checkAuth),
  AsyncErrorHandler(updatePasswordHandler)
);

// Admin routes
router.get(
  '/admin/all',
  AsyncErrorHandler(checkAuth),
  AsyncErrorHandler(authorizeRoles('admin')),
  AsyncErrorHandler(getAllUsers)
);
router
  .route('/admin/:userId')
  .get(
    AsyncErrorHandler(checkAuth),
    AsyncErrorHandler(authorizeRoles('admin')),
    AsyncErrorHandler(getUserById)
  )
  .put(
    AsyncErrorHandler(checkAuth),
    AsyncErrorHandler(authorizeRoles('admin')),
    AsyncErrorHandler(updateUserById)
  )
  .delete(
    AsyncErrorHandler(checkAuth),
    AsyncErrorHandler(authorizeRoles('admin')),
    AsyncErrorHandler(deleteUserById)
  );

export default router;
