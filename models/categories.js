import dbClient from "../config/dbClient.js";
import Joi from 'joi';
import { ObjectId } from "mongodb";

const categorySchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string(),
    products: Joi.array().items(Joi.string().regex(/^[a-f\d]{24}$/i)).default([])
});

class CategoryModel{
    #getCollection(){
        return dbClient.db.collection('categories');
    }

    async getAll(){
        const colCategories = this.#getCollection();
        return await colCategories.find({})
            .limit(10)
            .toArray();
    }

    async getById(id){
        const colCategories = this.#getCollection();
        return await colCategories.findOne({_id: new ObjectId(id)});
    }

    async create(category){
        const { error, value } = categorySchema.validate(category);
        if(error){
            throw new Error(`Informacion de categoria invalida: ${error.details[0].message}`);
        }
        value.products = (value.products || []).map(id => new ObjectId(id));
        const colCategories = this.#getCollection();
        return await colCategories.insertOne(value);
    }

    async getProductsByCategoryId(categoryId) {
        const categoryCollection = this.#getCollection();
        
        const result = await categoryCollection.aggregate([
            { $match: { _id: new ObjectId(categoryId) } },
            
            { $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'productDetails'
            }},
        ]).toArray();
    
        return result[0]?.productDetails || [];
    }

    async update(id, category){
        const colCategories = this.#getCollection();
        return await colCategories.updateOne({_id: new ObjectId(id)}, {$set: category});

    }
}

export default new CategoryModel();
