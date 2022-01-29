let cantNumerosAleatorios = process.argv[2];
let histograma = {};


process.on("message", msg => {
    if(msg === "start"){
        for(let i = 0; i < cantNumerosAleatorios; i++){
            const numAleatorio = Math.floor(Math.random() * 1000 + 1);
            if(numAleatorio in histograma){
                histograma[numAleatorio]++;
            }
            else{
                histograma[numAleatorio] = 1;
            }
        }

        process.send(histograma);
    }
})
