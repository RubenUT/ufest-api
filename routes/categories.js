import CategoryController from '../controllers/categories.js';
import express from 'express';

const route = express.Router();


route.get('/categories', CategoryController.getAll);
route.get('/categories/:id', CategoryController.getById);
route.get('/categories/:id/products', CategoryController.getProductsByCategoryId);
route.post('/categories/create', CategoryController.create);
route.put('/categories/:id', CategoryController.update);

export default route;