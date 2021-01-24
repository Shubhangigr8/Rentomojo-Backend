const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    
},{strict: true})

contactSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('contact', contactSchema)