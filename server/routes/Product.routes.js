import express from 'express';
import { addProduct,deleteProduct,getDetailsById,getProducts, updateProduct } from '../controllers/Product.controller.js';

const router = express.Router();

router.post('/',addProduct);

router.get('/',getProducts);

router.put('/:id',updateProduct);

router.get('/:id',getDetailsById);

router.delete('/:id',deleteProduct);

export default router;

