const express = require('express')
const moment = require('moment')
const Router = express.Router();
const authentification = require('./../auth/authentification')
const Reservation_h = require('../modal/Reservation_h')
const Room = require('../modal/Room')
const User = require('../modal/UserModal')


Router.use(authentification)

Router.get('/admin', async (req,res)=>{
    await Reservation_h.find({}).populate('user').populate('Room')
    .then(Res=>{
        res.status(200).json({
            message : "Reservation list",
            Reservations : Res
        })
    }).catch(err=>{
        res.json({
            message : "error",
           
        })
    })
})

Router.get('/:id', async (req,res)=>{
    await Reservation_h.find({user : req.params.id}).populate('Room')
    .then(Res=>{
        res.status(200).json({
            message : "Reservation list",
            Reservations : Res
        })
    }).catch(err=>{
        res.json({
            message : "error",
           
        })
    })
})

//room id 6023c242cb018a3cd85afe34
//user id 601c574b87964f2cfc102493

Router.post('/add',async(req,res)=>{
    const {startDate} = req.body
    const {endDate} = req.body
    const {room_id} = req.body
    const user_id = req.userData.userId
   const start =  moment(startDate).format('MM/DD/YYYY');
   const end =  moment(endDate).format('MM/DD/YYYY');

   var date1 = new Date(start);
   var date2 = new Date(end);
   var diffDays = date2.getDate() - date1.getDate(); 
   
   
    const theuser = await User.findOne({_id : user_id})
    const theroom =  await Room.findOne({_id : room_id})
     
    const prix_total = diffDays * theroom.Prix;

    if(diffDays === 0 ){
        const Reservation = new Reservation_h({
            nbr_nuit : 1 ,
            prix_total : theroom.Prix,
            user : theuser._id,
            Room :theroom._id,
            startDate : start,
            endDate : end,
        })
        
            const newreserv =  await  Reservation.save()
            theuser.Reservation_h.push(newreserv._id)
            theuser.save()
            res.status(200).json({
                message : 'Reservation added',
                newReservation : newreserv   
            })
    }
    else{
        const Reservation = new Reservation_h({
            nbr_nuit : diffDays ,
            prix_total : prix_total,
            user : theuser._id,
            Room :theroom._id,
            startDate : start,
            endDate : end,
        })
        
            const newreserv =  await  Reservation.save()
            theuser.Reservation_h.push(newreserv._id)
            theuser.save()
            res.status(200).json({
                message : 'Reservation added',
                newReservation : newreserv   
            })
    }
    
    
})


Router.delete('/:id', async (req,res)=>{
    const id = req.params.id
    const deletedres = await Reservation_h.findOne({_id : id})
    if(!deletedres) {
        res.status(201).json({
            message : "error"
        })
    }
     await Reservation_h.findOneAndDelete({_id : id})
     res.status(200).json({
         message : "Reservation deleted",
         Reservation_id : deletedres._id
     })
    
})


Router.put('/cancel/:id', async (req,res)=>{
   // Creating filer and storing new data
   const filter = { _id: req.params.id };
   const update = {
     state : "cancelled"
   };
   //find user BY _id and Update
   await Reservation_h.findOneAndUpdate(filter, update)
   .catch(err =>{
     res.status(201).json({
         message : "try again"
     })
   })
 const updatedres =  await Reservation_h.findOne(filter)
 res.status(200).json({
     message : "res updated",
    updatedres
 })
    
})



module.exports = Router;