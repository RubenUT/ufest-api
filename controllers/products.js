import ProductModel from "../models/products.js";

class ProductController{

    async getAll(req, res){
        try{
            const data = await ProductModel.getAll(req.body);
            res.status(200).json({data});
        }catch(e){
            res.status(400).json({ status: 'error', message: 'Error al obtener productos' });
        }
    };

    async create(req, res){
        try{
            const { name, price, description, image, categoryId } = req.body;
            const userId = req.userId;
            const data = await ProductModel.create({
                name, 
                price, 
                description, 
                image,
                userId: userId,
                categoryId
                });
            res.status(201).json({ status: 'success', data });
        }catch(e){
            res.status(400).json({ status: 'error', message: e.message });
        }
    };

    async getById(req,res){
        try{   
            const { id } = req.params;
            const data = await ProductModel.getById(id);
            res.status(200).json(data);
        }catch(e){
            res.status(400).json({ status: 'error', message: 'Error al obtener producto' });
        }
    }
};

export default new ProductController();