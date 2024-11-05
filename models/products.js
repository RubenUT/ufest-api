import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import Joi from "joi";

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().max(120).required(),
    image: Joi.string().allow(null, ''),
    userId: Joi.string().required(),
    categoryId: Joi.string().required()
});

class ProductModel{
    #getCollection(){
        return dbClient.db.collection('products');
    }

    async getAll(){
        const colProducts = this.#getCollection();
        return await colProducts.find({})
            .limit(10)
            .toArray();
    }

    async getById(id){
        const colProducts = this.#getCollection();
        return await colProducts.findOne({ _id: new ObjectId(id)});
    }
    
    async create(product) {
        const { error, value } = productSchema.validate(product);
        if (error) {
            throw new Error(`Informacion de producto invalida: ${error.details[0].message}`);
        }
    
        value.categoryId = new ObjectId(value.categoryId);
        value.userId = new ObjectId(value.userId);
    
        const colProducts = this.#getCollection();
        return await colProducts.insertOne(value);
    }

}

export default new ProductModel();
