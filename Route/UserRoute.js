const express = require('express')
const Router = express.Router();
const mongoose = require('mongoose')
const bycrpt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const User = require('../modal/UserModal')




Router.get('/', async (req,res)=>{
    await User.find({}).populate('Reservation_h')
    .then(user=>{
        res.json({
            message : "user list",
            users : user
        })
    }).catch(err=>{
        res.json({
            message : err,
           
        })
    })
})


Router.get('/:id', async (req,res)=>{
    await User.findOne({_id : req.params.id})
    .then(user=>{
        res.status(200).json({
            message : "user",
            user
        })
    }).catch(err=>{
        res.status(201).json({
            message : err,
           
        })
    })
})




Router.post('/singup', async (req,res)=>{
   const {name} = req.body
   const {lastname} = req.body
   const {email} = req.body
   const {password} = req.body
   const {phone} = req.body

   //check if user exists
  const emailexist = await User.findOne({email:req.body.email});
  if (emailexist) return res.status(201).json({
      message :"Email exists try another one"
  })

    //Hash password
    const salt = await bycrpt.genSalt(10);
    const hashpassword = await bycrpt.hash(password,salt);


   const newuser = new User({
    _id: new mongoose.Types.ObjectId(),
    name: name ,
    lastname : lastname,
    email : email,
    password : hashpassword,
    phone : phone
   })

   try {
    newuser.save()
    .then((user) =>{
         res.status(200).json({
             message : "user added",
         })
    })
   } catch (error) {
       res.json({
           status : 301,
           message :"error"
       })
   }

   
  
    
})


module.exports = Router;