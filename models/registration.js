const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var registrationSchema=new mongoose.Schema({
    name:String,
    gender:String,
    age:String,
    username:String,
    password:String
});
registrationSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("registration",registrationSchema);