const socket = io();

///esquemas de normalizacion
const authorSchema = new normalizr.schema.Entity("author", {}, {idAttribute: "email"});

const messageSchema = new normalizr.schema.Entity("message", {
    author: authorSchema
})

const chatSchema = new normalizr.schema.Entity("chat", {
    mensajes: [messageSchema]
})
///


while(!userEmail){
    var userEmail = prompt("Ingrese su email para continuar");
};

socket.on("mensajeDesdeServer", (data) => {
    renderMensajes(data);
})

socket.on("productoDesdeServer", (data) => {
    renderProductos(data);
})

const sendProducto = () => {
    const objProducto = {
        price: document.querySelector("#price").value,
        title: document.querySelector("#title").value,
        thumbnail: document.querySelector("#thumbnail").value
    }

    document.querySelector("#price").value = "";
    document.querySelector("#title").value = "";
    document.querySelector("#message").value = "";

    socket.emit("productoDesdeCliente", objProducto);

    return false;
}

const sendMessage = () => {
    
    const objMessage = {
        author: {
            email: userEmail
        },
        text: document.querySelector("#message").value
    };
    document.querySelector("#message").value = "";
    socket.emit("mensajeDesdeCliente", objMessage);


    return false;
}

const renderProductos = (data) => {
    const htmlProductos = data.map(producto => {
        return `
        <div class="card col-4 my-1">
            <img src="${producto.thumbnail}" class="card-img-top" alt="producto-generico">
            <div class="ard-body">
                <h5 class="card-title">${producto.title}</h5>
                <p class="card-text">${producto.price}</p>
            </div>
        </div>
        `
    }).join(" ")

    document.querySelector("#cajaProductos").innerHTML = htmlProductos;
}

const renderMensajes = (data) => {
    console.log(data)
    data = normalizr.denormalize("mensajes", chatSchema, data.entities)
    console.log(data)
    const htmlMsg = data.mensajes.map(msg => {
        if(userEmail === msg.author.email){
            return `
                <div class="w-75 align-self-end border rounded bg-primary text-white my-2 p-2" >
                    <p class="h5"> Tú: ${msg.text}</p>
                    <p class="text-right m-0 p-0"> ${moment(msg.fecha).format("DD/MM/YYYY HH:mm")}</p>
                    </div>
                    `
                }
                return `
                <div class="w-75 border rounded bg-info text-white my-2 p-2" >
                    <p class="h5"> ${msg.author.email}: ${msg.text}</p>
                    <p class="m-0 p-0"> ${moment(msg.fecha).format("DD/MM/YYYY HH:mm")}</p>
                </div>
        `
    }).join(" ")
    
    document.querySelector("#cajaMensajes").innerHTML = htmlMsg;
    

    const element = document.querySelector('#cajaMensajes');
    element.scrollTop = element.scrollHeight;
}

