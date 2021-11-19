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
    const listaMensajes = await ContenedorMensajes.getAll();
    socket.emit("mensajeDesdeServer", listaMensajes); ///carga inicial del chat

    ///proceso el mensaje del cliente
    socket.on("mensajeDesdeCliente", async (data) =>{
        const fecha = moment().format("DD/MM/YYYY, HH:mm:ss");        
        await ContenedorMensajes.save({timestamp: fecha, ...data});
        const listaMensajes = await ContenedorMensajes.getAll();
        io.sockets.emit("mensajeDesdeServer", listaMensajes);
    } )
    
})

/// --- Rutas ---

app.get("/", (req, res) => {
    res.render("index", {seccion: "form"});
});

app.get("/productos", async (req, res) => {
    const productos = await ContenedorProd.getAll();
    res.render("index", {seccion: "productos", data: productos});
});

app.get("/chat", (req, res) => {
    res.render("index", {seccion: "chat"})
})

/// --- Inicio del server

server.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`);
})

