
const text = require('body-parser/lib/types/text');
const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    title: String,
    images: [
        {
            id: {
                type: String,
                required: true,
            },
            secure_url: {
                type: String,
                required: true
            }

        
        

        }
    ],

password: {
    type: String,
        required: [true, 'password cannot be blank']
},

phone: Number


});




module.exports = mongoose.model('User', userschema);