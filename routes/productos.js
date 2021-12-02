const express = require("express");
const {Router} = express;
const Contenedor = require("../contenedor")
const router = Router();

router.use(express.json());

///DB
const ContenedorDB = require("../contenedorDB");
const mysql = require("../db/mysql");
const ContenedorProductosDB = new ContenedorDB(mysql, "productos");


///Devuelve todos los productos
router.get("/", async (req, res) => {
    const productos = await ContenedorProductosDB.getAll();

    if(!productos){
        res.sendStatus(404);
        return;
    }

    res.json(productos);
})


///Guarda un productos y retorna su ID
router.post("/", async (req, res) => {
    const productoSave = {
        ...req.body,
        price: req.body.price   
    }
    if(!productoSave.thumbnail){
        productoSave.thumbnail = "https://justmockup.com/wp-content/uploads/edd/2019/08/box-packaging-mockup-free-download.jpg"
    }
    
    const id = await ContenedorProductosDB.save(productoSave);
    res.redirect("/");
})

router.put("/:id", async (req, res) => {
    const productoUpdate = {
        id: parseInt(req.params.id),
        ...req.body
    }

    ///BUSCO EL PRODUCTO ANTES DE ACTUALIZAR
    const producto = await ContenedorProductosDB.getById(productoUpdate.id);
    if(!producto){
        res.sendStatus(404);
        return;
    }

    const respuesta = await ContenedorProductosDB.updateProductById(productoUpdate);
    res.json(respuesta);
})


router.delete("/:id", async (req, res) =>{
    const id = parseInt(req.params.id);
    const response = await ContenedorProductosDB.deleteById(parseInt(id));

    if(!response){
        res.sendStatus(404);
        return;
    }
    res.json({ 
        code: 200,
        status: "Elemento eliminado correctamente"
    });
})

///Devuelve un producto por ID 
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const producto = await ContenedorProductosDB.getById(id);

    if(!producto){
        res.sendStatus(404);
        return;
    }

    res.json(producto);
})


module.exports = router;