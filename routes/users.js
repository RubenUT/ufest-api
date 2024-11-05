import express from 'express';
import UserController from '../controllers/users.js';

const route = express.Router();

route.get('/users', UserController.getAll);

route.post('/login', UserController.login);

route.get('/users/:id', UserController.getById);

route.post('/register', UserController.create);

route.put('/users/:id', UserController.update);

route.delete('/:id', UserController.delete);

export default route;