import CategoryModel from "../models/categories.js";

class CategoryController{

    async getAll(req, res){
        try{
            const data = await CategoryModel.getAll();
            res.status(200).json({data});
        }catch(e){
            res.status(400).json({ status: 'error', message: 'Error al obtener categorias' });
        }
    }

    async getById(req, res){
        try{
            const { id } = req.params;
            const data = await CategoryModel.getById(id)
            res.status(200).json(data);
        }catch(e){
            res.status(400).json({status: 'error', message: 'Error al obtener categoria'});
        }
    }

    async getProductsByCategoryId(req, res) {
        try {
            const { id } = req.params;
            const products = await CategoryModel.getProductsByCategoryId(id);
    
            if (products.length === 0) {
                return res.status(404).json({ message: 'No products found for this category' });
            }
    
            res.status(200).json({ products });
        } catch (e) {
            res.status(400).json({ status: 'error', message: 'Error al obtener productos de la categoria', error: e.message });
        }
    }

    async create(req, res){
        try{
            const { name, image, products } = req.body;
            const data = await CategoryModel.create({ name, image, products });
            res.status(201).json({ status: 'success', data });
        }catch(e){
            res.status(400).json({ status: 'error', message: 'Error al intentar crear la categoria', error: e.message });
        }
    }

    async update(req,res){
        try{
            const { id } = req.params;
            const data = await CategoryModel.update(id, req.body);
            res.status(200).json(data);
        }catch(e){
            res.status(400).json({ status: 'error', message: 'Error al intentar actualizar la categoria', error: e.message });
        }
    }

}

export default new CategoryController();