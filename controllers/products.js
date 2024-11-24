import ProductModel from "../models/products.js";
import dbClient from "../config/dbClient.js";
import { ObjectId } from "mongodb";

class ProductController {

    async getAll(req, res) {
        try {
            const data = await ProductModel.getAll(req.body);
            res.status(200).json({ data });
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al obtener productos' });
        }
    };

    async getById(req, res) {
        try {
            const { id } = req.params;
            const productData = await ProductModel.getById(id);

            if (!productData) {
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
            }

            const userCollection = dbClient.db.collection('users');
            const user = await userCollection.findOne({ _id: new ObjectId(productData.userId) });

            const responseData = {
                ...productData,
                sellerName: user ? user.name : "John Doe",
                sellerPhone: user ? user.phone : "1234567890"
            };
            
            res.status(200).json({ data: responseData });
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al obtener producto' });
        }
    }

    async search(req, res) {
        try {
            const { query } = req.query;
            const data = await ProductModel.search(query);
            
            res.status(200).json({ data });
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al buscar productos' });
        }
    }

    async create(req, res) {
        try {
            const { name, price, description, image, categoryId } = req.body;
            const userId = req.userId;

            const productData = {
                name,
                price,
                description,
                image,
                userId: userId,
                categoryId
            }
            const createdProduct = await ProductModel.create(productData);

            const categoryCollection = dbClient.db.collection('categories');
            await categoryCollection.updateOne(
                { _id: new ObjectId(categoryId) },
                { $push: { products: createdProduct._id } }
            );

            const userCollection = dbClient.db.collection('users');
            const user = await userCollection.findOne({ _id: new ObjectId(userId) });

            const responseData = {
                ...createdProduct,
                sellerName: user.name
            };

            res.status(201).json({ status: 'success', data: responseData });
        } catch (e) {
            res.status(400).json({ status: 'error', message: e.message });
        }
    };

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = await ProductModel.update(id, req.body);
            res.status(200).json(data);
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al actualizar producto', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductModel.delete(id);
            res.status(200).json({ status: 'success', message: result.message });
        } catch (e) {
            res.status(400).json({ status: 'error', message: e.message });
        }
    }

};

export default new ProductController();