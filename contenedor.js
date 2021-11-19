const fs = require('fs');

module.exports = class Contenedor {
    constructor(_path){
        this.path = _path;
    }
    async save(_elemento){
        if(!_elemento){
            console.log("Guardado abortado: Es necesario enviar el parámetro \"Objeto\"");
            return -1;
        }
        
        let elementos = await this.getAll();
        if(!elementos){
            prodelementosuctos = [];
        }

        _elemento = {..._elemento, id: await this.getMaxId() + 1}
        elementos.push(_elemento);

        await fs.promises.writeFile(this.path, JSON.stringify(elementos, null, 2), "utf-8");

        return _elemento.id;
    }
    async getById(_id){
        const data = await fs.promises.readFile(this.path, "utf-8");
        const elementos = JSON.parse(data);
        return elementos.filter(elemento => elemento.id === _id)[0];
    }
    async updateProductById(_elemento){
        const elementos = await this.getAll();

        if(! await this.getById(_elemento.id)){
            return { error : 'producto no encontrado' }
        }

        const elementosNuevos = elementos.map(elemento => {
            if(elemento.id === _elemento.id){
                elemento = _elemento
            }
            return elemento;
        })


        await fs.promises.writeFile(this.path, JSON.stringify(elementosNuevos, null, 2)); 
        return _elemento;
    }

    async getAll(){
        const data = await fs.promises.readFile(this.path, "utf-8");
        const elementos =  JSON.parse(data);
        return elementos;
    }
    async deleteById(_id){
        if(! await this.getById(_id)){
            return { error : 'producto no encontrado' }
        }
        const elementos = await this.getAll();
        const elementosNuevo = elementos.filter(elemento => elemento.id !== _id);

        await fs.promises.writeFile(this.path, JSON.stringify(elementosNuevo, null, 2));

        return {status: "deleted"};
    }
    async deleteAll(){
        await fs.promises.writeFile(this.path, "[]");
        return "ok";
    }
    async getMaxId(){
        const elementos = await this.getAll();
        if(!elementos){
            return 0;
        }
        let maxID = 0;
        elementos.forEach(elemento => {
            if(elemento.id > maxID){
                maxID = elemento.id;
            }
        });
        return maxID;

    }
}
