import mongoose from "mongoose";

const {Schema, model} = mongoose;

const userschema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String}
})

export default model("users", userschema);