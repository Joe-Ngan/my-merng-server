const { model, Schema} = require('mongoose');

const userSchma = new Schema({
    username: String,
    password: String,
    email: String, 
    createdAt: String
})

module.exports = model('User', userSchma);