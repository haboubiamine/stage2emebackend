const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const RoomSchema = Schema({
    Title: String ,
    Prix : Number,
    nbr_pl : Number,
    image_url : String,
    description : String
});


module.exports = mongoose.model('Room', RoomSchema);