const express = require("express");
const http = require('http');
const productosRoutes = require("./routes/productos");


///DB
const ContenedorDB = require("./contenedorDB");
const mysql = require("./db/mysql");
const sqlite3 = require("./db/sqlite3");
const ContenedorProductosDB = new ContenedorDB(mysql, "productos");
const ContenedorMensajesDB = new ContenedorDB(sqlite3, "mensajes");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

/// --- EJS config ---

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
    let listaMensajes = await ContenedorMensajesDB.getAll();
    const listaProductos = await ContenedorProductosDB.getAll();
    socket.emit("mensajeDesdeServer", listaMensajes); ///carga inicial del chat
    socket.emit("productoDesdeServer", listaProductos);

    ///guardo el mensaje del cliente
    socket.on("mensajeDesdeCliente", async (data) =>{
        const mensajeSave = {
            ...data
        } 

        await ContenedorMensajesDB.save(mensajeSave);
        const listaMensajes = await ContenedorMensajesDB.getAll();
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
        
        await ContenedorProductosDB.save(productoSave);
        const listaProductos = await ContenedorProductosDB.getAll();


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

