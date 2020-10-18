const mongoose= require('mongoose');

const whatsappSchema = mongoose.Schema({
    message:String,
    name:String,
    timestamp:String,
    received:Boolean
})

mongoose.model('Messages',whatsappSchema)