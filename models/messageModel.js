const mongoose = require('mongoose');
const { Schema } = mongoose;
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

mongoose.connection.on("open", () => {
    // console.log("Base de MONGO conectada");
})


mongoose.connection.on("error", () => {
    console.log("error al conectar a mongo");
})

const messageSchema = new Schema({
    id:String,
    author: {
            email: {
                type: String
            },
            nombre: {
                type: String,
                default: ""
            },
            apellido: {
                type: String,
                default: ""
            },
            edad: {
                type:Number
            },
            alias: {
                type: String,
                default: ""
            },
            avatar: {
                type: String,
                default: "https://w7.pngwing.com/pngs/85/114/png-transparent-avatar-user-profile-male-logo-profile-icon-hand-monochrome-head.png"
            }
    },
    text: {
        type:String
    }
})

const messageModel = mongoose.model("messages", messageSchema);



module.exports = messageModel;