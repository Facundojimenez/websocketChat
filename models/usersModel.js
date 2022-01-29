const mongoose = require('mongoose');
const { Schema } = mongoose;
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

mongoose.connection.on("open", () => {
    console.log("Base de MONGO conectada");
})


mongoose.connection.on("error", () => {
    console.log("error al conectar a mongo");
})

const usersSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
        immutable: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    }
})

const usersModel = mongoose.model("users", usersSchema);



module.exports = usersModel;