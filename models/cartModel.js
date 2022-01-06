const mongoose = require('mongoose');
const { Schema } = mongoose;
const config = require("../config");


mongoose.connect(config.mongodb.connectionString);

mongoose.connection.on("open", () => {
    console.log("Base de MONGO conectada");
})


mongoose.connection.on("error", () => {
    console.log("error al conectar a mongo");
})

const cartsSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now(),
        immutable: true
    },
    products: [
        {
            title: {
                type: String,
                default: "PRODUCTO SIN NOMBRE"
            },
            description: {
                type: String,
                default: ""
            },
            SKU: {
                type: String,
                default: ""
            },
            thumbnail: {
                type:String,
                default: "https://justmockup.com/wp-content/uploads/edd/2019/08/box-packaging-mockup-free-download.jpg"
            },
            price: {
                type: Number,
                default: 0
            },
            stock: {
                type: Number,
                default: 0
            }
        }
    ]
})

const cartsModel = mongoose.model("carts", cartsSchema);



module.exports = cartsModel;