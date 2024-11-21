import UserModel from '../models/users.js';
import ProductModel from '../models/products.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.getByEmail(email);

            if (!user) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )

            res.status(200).json({ message: "Inicio de sesión exitoso", token });
        } catch (error) {
            res.status(500).json({ message: "Error en el servidor" });
        }
    };


    async getAll(req, res) {
        try {
            const data = await UserModel.getAll(req.body);
            res.status(200).json({ data });
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al obtener usuarios' });
        }
    };

    async getProfile(req, res) {
        try {
            const _id = req.userId;
            const user = await UserModel.getById(_id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json({ data: user });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener perfil del usuario", message: e.message });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
    
            if (!id) {
                return res.status(400).json({ message: "Se requiere un ID válido." });
            }
    
            const user = await UserModel.getById(id);
    
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
    
            res.status(200).json({ data: user });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el usuario.", error: error.message });
        }
    }

    async getUserProducts(req, res) {
        try {
            const { id } = req.params;
            const products = await ProductModel.getByUserId(id);

            if (!products || products.length === 0) {
                return res.status(404).json({ message: "No se encontraron productos para este usuario" });
            }

            res.status(200).json({ data: products });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener productos del usuario", error: error.message });
        }
    }

    async create(req, res) {
        try {
            const { email, password, name, phone, description, image } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: 'error', message: 'Email y contraseña son requeridos' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            const data = await UserModel.create({ email, password: hashedPassword, name, phone, description, image });
            res.status(201).json({ status: 'success', data });
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al crear usuario' });
        }
    };

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = await UserModel.update(id, req.body);
            res.status(200).json(data);
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al actualizar usuario' });
        }
    };

    async delete(req, res) {
        try {
            const { id } = req.params;
            const data = await UserModel.delete(id);
            res.status(206).json({ status: 'success', message: 'Usuario eliminado' });
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al eliminar usuario' });
        }
    };
}

export default new UserController();