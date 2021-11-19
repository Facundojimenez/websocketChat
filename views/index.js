const socket = io();

while(!userEmail){
    var userEmail = prompt("Ingrese su email para continuar");
};

socket.on("mensajeDesdeServer", (data) => {
    renderMensajes(data);
})

const sendMessage = () => {
    
    const objMessage = {
        userEmail: userEmail,
        message: document.querySelector("#message").value
    };
    document.querySelector("#message").value = "";
    socket.emit("mensajeDesdeCliente", objMessage);

    return false;
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
