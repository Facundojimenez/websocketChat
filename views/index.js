const socket = io();

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
    console.log("prod enviado")
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
        userEmail: userEmail,
        message: document.querySelector("#message").value
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

    const htmlMsg = data.map(msg => {
        if(userEmail === msg.userEmail){
            return `
                <div class="w-75 align-self-end border rounded bg-primary text-white my-2 p-2" >
                    <p class="h5"> Tú: ${msg.message}</p>
                    <p class="text-right m-0 p-0"> ${msg.timestamp}</p>
                    </div>
                    `
                }
                return `
                <div class="w-75 border rounded bg-info text-white my-2 p-2" >
                    <p class="h5"> ${msg.userEmail}: ${msg.message}</p>
                    <p class="m-0 p-0"> ${msg.timestamp}</p>
                </div>
        `
    }).join(" ")
    
    document.querySelector("#cajaMensajes").innerHTML = htmlMsg;
    

    const element = document.querySelector('#cajaMensajes');
    element.scrollTop = element.scrollHeight;
}
