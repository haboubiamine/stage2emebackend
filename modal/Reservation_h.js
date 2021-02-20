const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const Reservation_hSchema = Schema({
    nbr_nuit : Number ,
    prix_total : Number,
    startDate : String,
    endDate : String,
    state : {
        type: String,
        default:"active"
      },
    user :{ type: Schema.Types.ObjectId, ref: 'User' },
    Room :{ type: Schema.Types.ObjectId, ref: 'Room' }
});


module.exports = mongoose.model('Reservation_h', Reservation_hSchema);