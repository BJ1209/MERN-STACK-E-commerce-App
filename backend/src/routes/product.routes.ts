import { Router } from 'express';
import { createNewProduct, getAllProducts } from '../controllers/product.controller';

const router: Router = Router();

router.get('/', getAllProducts);
router.post('/new', createNewProduct);

export default router;
