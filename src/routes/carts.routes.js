import { Router } from "express";
//import cartManager from '../managers/cartsManager.js'
import cartDao from "../dao/mongoDao/cart.dao.js";

const router = Router()

//config solicitudes/peticiones
router.post('/', newCart)
router.get('/:cid', cartlist)
router.post('/:cid/product/:pid', addproductTocart)
//config callbacks

async function newCart(req, res) {
    try {
        const cart = await cartDao.create();
        res.status(201).json(cart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, response: error.message });
    }
}

async function cartlist (req, res) {
    try{
        const {cid} = req.params;
        const cart = await cartDao.getById(cid)
        if (cart) {
            return res.json({ status: 200, response: cart });
          } else {
            const error = new Error("Not found!");
            error.status = 404;
            throw error;
          }
    }catch (error) {
        console.log(error);
        return res.json({
          status: error.status || 500,
          response: error.message || "ERROR",
        })
    }
}

async function addproductTocart (req, res) {
    try {
        const {cid, pid} = req.params
        const cart = await cartDao.addProductToCart(cid, pid)
        if (cart) {
            return res.json({ status: 201, response: cart });
          } else {
            const error = new Error("Not found!");
            error.status = 404;
            throw error;
          }
    }catch (error) {
        console.log(error);
        return res.json({
          status: error.status || 500,
          response: error.message || "ERROR",
        })
    }
}

export default router