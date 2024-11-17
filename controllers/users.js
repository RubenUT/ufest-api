import UserModel from '../models/users.js';
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

    async getById(req, res) {
        try {
            const { id } = req.params;
            const data = await UserModel.getById(id);
            res.status(200).json(data);
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al obtener usuario', message: e.message });
        }
    };

    async create(req, res) {
        try {
            const { email, password, name, phone } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: 'error', message: 'Email y contraseña son requeridos' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            const data = await UserModel.create({ email, password: hashedPassword, name, phone });
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