import dbClient from "../config/dbClient.js";
import Joi from 'joi';
import { ObjectId } from "mongodb";

const categorySchema = Joi.object({
    name: Joi.string().required(),
    products: Joi.array().items(Joi.string())
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

        const colProducts = this.#getCollection();
        return await colProducts.insertOne(value);
    }

    async getProductsByCategoryId(categoryId) {
        const categoryCollection = this.#getCollection();
    
        const result = await categoryCollection.aggregate([
            { $match: { _id: new ObjectId(categoryId) } },
            
            { $addFields: {
                products: {
                    $map: {
                        input: "$products",
                        as: "productId",
                        in: { $toObjectId: "$$productId" }
                    }
                }
            }},
            
            { $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'productDetails'
            }},
        ]).toArray();
    
        return result[0]?.productDetails || [];
    }
}

export default new CategoryModel();
