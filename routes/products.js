import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import ProductController from '../controllers/products.js';

const route = express.Router();

route.get('/products', ProductController.getAll);
route.get('/products/:id', ProductController.getById);
route.post('/products/create', authMiddleware, ProductController.create);

export default route;