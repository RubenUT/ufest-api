import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import Joi from 'joi';

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string(),
    name: Joi.string().default(Joi.ref('email')),
    phone: Joi.string(),
});

class UserModel {

    #getCollection() {
        return dbClient.db.collection('users');
    }

    async getByEmail(email) {
        const colUsers = this.#getCollection();
        return await colUsers.findOne({ email });
    }

    async create(user) {
        const { error, value } = userSchema.validate(user);
        if (error) {
            throw new Error(`Informacion de usuario invalida: ${error.details[0].message}`);
        }

        const colUsers = this.#getCollection();
        const existingUser = await colUsers.findOne({ email: value.email });
        if (existingUser) {
            throw new Error('El correo electrónico ya está en uso');
        }

        return await colUsers.insertOne(value);
    }

    async getAll() {
        const colUsers = this.#getCollection();
        return await colUsers.find({})
            .limit(10)
            .toArray();
    }

    async getById(id) {
        const colUsers = this.#getCollection();
        return await colUsers.findOne({ _id: new ObjectId(id) });
    }

    async update(id, user) {
        const colUsers = this.#getCollection();
        return await colUsers.updateOne({ _id: new ObjectId(id) }, { $set: user });
    }

    async delete(id) {
        const colUsers = this.#getCollection();
        return await colUsers.deleteOne({ _id: new ObjectId(id) });
    }
}

export default new UserModel();