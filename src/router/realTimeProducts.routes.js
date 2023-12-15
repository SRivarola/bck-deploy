import { Router } from 'express';
// import model for mongoose
import Product from '../dao/models/products.js';
//import manager FS
// import ProductManager from "../dao/manager/ProductManager.js";
import __dirname from '../../utils.js';

const rtProductsRouter = Router();
// const manager = new ProductManager(`${__dirname}/files/products.json`);

rtProductsRouter.get('/', async (req, res, next) => {
    try {
        let products = await Product.find().lean()
        res.status(200).render('realTimeProducts', { products })
    } catch (error) {
        next(error)
    }

    // esto es para FS
    // const { limit } = req.query;
    // let products = await manager.getProducts();
    // if(limit) products = products.slice(0, Number(limit));
    // res.send({ status: 'success', payload: products });
    
    // res.render('realTimeProducts', {products})
});

export default rtProductsRouter