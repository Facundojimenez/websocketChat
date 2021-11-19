const express = require("express");
const moment = require('moment');
const http = require('http');
const productosRoutes = require("./routes/productos");
const Contenedor = require("./contenedor");


const ContenedorProd = new Contenedor("./productos.txt");
const ContenedorMensajes = new Contenedor("./chats.json");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = process.env.port || 3001;

/// --- Handlebars config ---

app.set("views", "./views");
app.set("view engine", "ejs");

/// --- MiddleWares ---

app.use(express.urlencoded({extended: false}));
app.use(express.static("./views"));
app.use("/api/productos", productosRoutes);


/// WebSockets

io.on("connection", async (socket) => {
    console.log("Cliente conectado");
    //carga inicial de la pagina
    const listaMensajes = await ContenedorMensajes.getAll();
    const listaProductos = await ContenedorProd.getAll();
    socket.emit("mensajeDesdeServer", listaMensajes); ///carga inicial del chat
    socket.emit("productoDesdeServer", listaProductos);

    ///guardo el mensaje del cliente
    socket.on("mensajeDesdeCliente", async (data) =>{
        const mensajeSave = {
            ...data,
            timestamp: moment().format("DD/MM/YYYY, HH:mm:ss")
        } 

        await ContenedorMensajes.save(mensajeSave);
        const listaMensajes = await ContenedorMensajes.getAll();
        io.sockets.emit("mensajeDesdeServer", listaMensajes);
    } )

    ///guardo el producto
    socket.on("productoDesdeCliente", async (data) => {
        const productoSave = {
            ...data,
            price: parseInt(data.price)   
        }
        if(!productoSave.thumbnail){
            productoSave.thumbnail = "https://justmockup.com/wp-content/uploads/edd/2019/08/box-packaging-mockup-free-download.jpg"
        }
        
        await ContenedorProd.save(productoSave);
        const listaProductos = await ContenedorProd.getAll();


        io.sockets.emit("productoDesdeServer", listaProductos);
    })
    
})

/// --- Rutas ---

app.get("/", async (req, res) => {
    res.render("index");
});

/// --- Inicio del server

server.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`);
})

