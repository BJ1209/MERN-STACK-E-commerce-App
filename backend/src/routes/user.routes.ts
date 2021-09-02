import { Router } from 'express';
import { loginHandler, logoutHandler, newUser } from '../controllers/user.controller';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.post('/new', AsyncErrorHandler(newUser));

router.post('/login', AsyncErrorHandler(loginHandler));

router.get('/logout', AsyncErrorHandler(logoutHandler));

export default router;
