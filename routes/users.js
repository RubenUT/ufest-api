import express from 'express';
import UserController from '../controllers/users.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const route = express.Router();

route.get('/users', UserController.getAll);

route.post('/login', UserController.login);

route.get('/users/me', authMiddleware, UserController.getProfile);

route.get('/users/:id', authMiddleware, UserController.getUserById);

route.get('/users/:id/products', authMiddleware, UserController.getUserProducts);

route.post('/register', UserController.create);

route.put('/users/:id', UserController.update);

route.delete('/:id', UserController.delete);

export default route;