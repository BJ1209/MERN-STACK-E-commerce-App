import { Router } from 'express';
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  newUser,
  verifyResetTokenHandler,
} from '../controllers/user.controller';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.post('/new', AsyncErrorHandler(newUser));

router.post('/login', AsyncErrorHandler(loginHandler));

router.get('/logout', AsyncErrorHandler(logoutHandler));

router.post('/forgot-password', AsyncErrorHandler(forgotPasswordHandler));

router.post('/reset/:resetToken', AsyncErrorHandler(verifyResetTokenHandler));

export default router;
