const express = require("express");
const {Router} = express;
const router = Router();
const {fork} = require("child_process")

router.use(express.json());


///Devuelve todos los productos
router.get("/", async (req, res) => {
    let cantNumerosAleatorios = 100000000;

    if(req.query.cant){
        cantNumerosAleatorios = req.query.cant;
    }

    const computo = fork(__dirname + "/randomsCalculo.js", [cantNumerosAleatorios]);
    computo.send("start");
    computo.on("message", (obj) => {
        res.json(obj);
    })

})



module.exports = router;