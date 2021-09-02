import { Router } from 'express';
import { loginHandler, newUser } from '../controllers/user.controller';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.post('/new', AsyncErrorHandler(newUser));

router.post('/login', AsyncErrorHandler(loginHandler));

export default router;
