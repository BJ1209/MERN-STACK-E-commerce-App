import { Router } from 'express';
import { newUser } from '../controllers/user.controller';
import AsyncErrorHandler from '../utils/AsyncErrorHandler';

const router: Router = Router();

router.post('/new', AsyncErrorHandler(newUser));

export default router;
