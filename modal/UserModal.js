const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const userSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String ,
    lastname : String,
    email : String,
    password : String,
    phone : String,
    role: {
        type: String,
        default:"user"
      },
    Reservation_h : [{ type: Schema.Types.ObjectId, ref: 'Reservation_h' }]

});


module.exports = mongoose.model('User', userSchema);