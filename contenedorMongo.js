const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

mongoose.connection.on("open", () => {
    // console.log("Base de MONGO conectada");
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
    async getByUsername(_username){
        try{
            const elemento = await this.model.find({ username: _username}).exec();
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