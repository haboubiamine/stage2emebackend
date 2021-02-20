const express = require('express')
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require('cors');
const bycrpt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const App = express();
App.use(express.static('uploads/'));

// Router
const UserRoute = require('./Route/UserRoute')
const RoomRoute = require('./Route/RoomRoute')
const authRoute = require('./Route/authRoute')
const Reservation_h = require('./Route/Reservation_hRoute')


// middleware

dotenv.config();
App.use(cors())
// App.use(morgan('dev'))
App.use(express.json());
App.use(express.urlencoded({extended: false}))



// DB Config
mongoose.connect(process.env.DB, {useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false});

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log("we're connected!");

    });


// Router


App.use('/User',UserRoute)
App.use('/Auth',authRoute)
App.use('/Room',RoomRoute)
App.use('/Reservation_h',Reservation_h)


App.get('/',(req,res)=>{
    res.json({
        message: "fuck you"
    })
})


 App.listen(process.env.PORT || 3001 , ()=>{console.log("server running on "+3001)})


