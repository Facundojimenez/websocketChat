const mongoose = require('mongoose');
const config = require("./config");

mongoose.connect(config.mongodb.connectionString);

mongoose.connection.on("open", () => {
    console.log("Base de MONGO conectada");
})


mongoose.connection.on("error", () => {
    console.log("error al conectar a mongo");
})

module.exports = class ContenedorMongo {
    constructor(_model){
        this.model = _model;
    }

    async getById(_id){
        try{
            const elemento = await this.model.findById(_id);
            return elemento;
        }
        catch(err){
            return {};
        }
    }

    async save(_elemento){
        const elemento = await _elemento.save();
        return elemento;
    }
    
    async updateById(_elemento){
        const res = await this.model.findByIdAndUpdate(_elemento.id, _elemento);
        return res;
    }

    async getAll(){
        const elementos = await this.model.find({});
        return elementos;
    }

    async deleteById(_id){
        const res = await this.model.findByIdAndDelete(_id);
        return res;
    }

    async deleteAll(){
        const res = await this.model.deleteMany({});
        return {};
    }
}