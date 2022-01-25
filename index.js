const express = require("express");
const http = require('http');
const productosRoutes = require("./routes/productos");
const {normalize, schema} = require("normalizr");
var uuid = require('uuid');
const faker = require("faker");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

/// --- Esquemas de normalizaciones ---
const authorSchema = new schema.Entity("author", {}, {idAttribute: "email"});

const messageSchema = new schema.Entity("message", {
    author: authorSchema
})

const chatSchema = new schema.Entity("chat", {
    mensajes: [messageSchema]
})

/// --- DB ---
const ContenedorMongo = require("./contenedorMongo");
const ContenedorProductosSQL = require("./contenedorDB");
const mysql = require("./db/mysql");
const messageModel = require("./models/messageModel");
const usersModel = require("./models/usersModel");
const ContenedorMensajesDB = new ContenedorMongo(messageModel);
const ContenedorUsuariosDB = new ContenedorMongo(usersModel);
const ContenedorProductosDB = new ContenedorProductosSQL(mysql, "productos");

// Autenticacion y autorizacion

passport.use("local-login", new LocalStrategy((username, password, done) => {
    const buscarUser = async (username) =>{
        const res = await ContenedorUsuariosDB.getByUsername(username);
        const user = res[0]
        
        if(!user){ ///no se encontró el usuario
            done(null, false);
            return;
        }

        bcrypt.compare(password, user.password, function(err, result) {
            if(!result){ ///no coincide la contraseña
                done(null, false)
                return;
            }

            done(null, user);
        });

    }

    buscarUser(username)
}))

passport.use("local-signup", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, (req, username, password, done) => {
    const buscarUser = async (username) =>{
        const res = await ContenedorUsuariosDB.getByUsername(username);
        const user = res[0];

        if(user){ ///el usuario ya existe
            done(null, false);
            return;
        }

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            const newUser = new usersModel({
                username,
                password: hash
            })
    
            const createdUser = await ContenedorUsuariosDB.save(newUser);
    
            done(null, createdUser)
            // Store hash in your password DB.
        });

    }

    buscarUser(username)
}))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(async (_id, done) => {
    const user = await ContenedorUsuariosDB.getById(_id);
    done(null, user);
})


const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

/// --- EJS config ---

app.set("views", "./views");
app.set("view engine", "ejs");

/// --- MiddleWares ---
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("./views"));
app.use("/api/productos", productosRoutes);
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://facundoj:Facu2000@cluster0.1w4mu.mongodb.net/desafioAPI?retryWrites=true&w=majority",
        ttl: 60
    }),
    secret: 'mi_secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

/// --- WebSockets

io.on("connection", async (socket) => {
    console.log("Cliente conectado");
    //carga inicial de la pagina
    let listaMensajes = await ContenedorMensajesDB.getAll();
    listaMensajes = listaMensajes.map(elem => {     ///le quito los atributos de mongoDB
        return {author: elem.author, id:  elem.id, text: elem.text};
    });
    listaMensajes = {id: "mensajes", mensajes: listaMensajes}
    listaMensajes = normalize(listaMensajes, chatSchema);
    const listaProductos = await ContenedorProductosDB.getAll();

    socket.emit("mensajeDesdeServer", listaMensajes); ///carga inicial del chat
    socket.emit("productoDesdeServer", listaProductos);

    ///guardo el mensaje del cliente
    socket.on("mensajeDesdeCliente", async (data) =>{

        const mensajeSave = new messageModel();
        mensajeSave.overwrite({id: uuid.v4(), ...data})
        await ContenedorMensajesDB.save(mensajeSave);

        let listaMensajes = await ContenedorMensajesDB.getAll();
        listaMensajes = listaMensajes.map(elem => {     ///le quito los atributos de mongoDB
            return {author: elem.author, id:  elem.id, text: elem.text};
        });
        listaMensajes = {id: "mensajes", mensajes: listaMensajes}
        listaMensajes = normalize(listaMensajes, chatSchema);

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

/// --- Funciones auxiliares
const auth = (req, res, next) =>{

    if(req.isAuthenticated()){
        return next()
    }

    res.redirect("/login")
}

/// --- Rutas ---

app.get("/", auth, async (req, res) => {

    console.log(req.session.passport.user)
    res.render("index", {seccion: "form", user: req.session.passport.user});
});

app.get("/login", async (req, res) => {
    res.render("index", {seccion: "login"});
});

app.get("/login/error", async (req, res) => {
    res.render("index", {seccion: "loginError"})
});

app.post("/login/auth", passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login/error"
}), (req, res) => {

});

app.get("/signup", async (req, res) => {
    res.render("index", {seccion: "signUp"});
});

app.get("/signup/error", async (req, res) => {

    res.render("index", {seccion: "signUpError"});
});

app.post("/signup/auth", passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup/error"
}));

app.get("/logout", auth, async (req, res) => {
    req.logOut();
    res.redirect("/login")
});

app.get("/productos", auth, async (req, res) => {
    const productos = await ContenedorProductosDB.getAll();
    res.render("index", {seccion: "productos", data: productos, user: req.session.passport.user});
})

app.get("/api/productos-test", auth, async (req, res) => {
    const productos = [];
    for(let i = 0; i < 5; i++){
        productos.push({
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.image(), ///las otras opciones de imagenes de faker no funcionan muy bien, asi que preferi usar imagenes aleatorias
        })
    }

    // const productos = await ContenedorProd.getAll();
    res.render("index", {seccion: "productos", data: productos, user: req.session.passport.user});
});

/// --- Inicio del server

server.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`);
})

