import { Router } from 'express';
import { getAllProducts } from '../controllers/product.controller';

const router: Router = Router();

router.get('/', getAllProducts);
export default router;
