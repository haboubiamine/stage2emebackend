const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const bycrpt = require("bcryptjs");
const User = require('./../modal/UserModal')

Router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //check if user exists
const user = await User.findOne({email:email});
if (!user) return res.status(201).json({
    message : "email incorrect"
})

//Passwor incorrect
const validpassword = await bycrpt.compare(password,user.password)
if (!validpassword) return res.status(201).json({
    message :"password incorrect"
  })
  

//create Token
const Token = jwt.sign({_id: user._id , role : user.role},process.env.SECRET_CODE);
res.status(200).json({
  token : Token,
  user

})
});



Router.put('/update/:id',async (req , res)=>{

  const password = req.body.password;

  //check if user exists
const user = await User.findOne({_id: req.params.id});
if (!user) return res.status(201).json({
    message : "user not here"
})

//Passwor incorrect
const validpassword = await bycrpt.compare(password,user.password)
if (!validpassword) return res.status(201).json({
    message :"password incorrect"
  })

  const filter = { _id: req.params.id };
  const update = {
    name : req.body.name,
    lastname : req.body.lastname ,
    email : req.body.email ,
    phone : req.body.phone ,
  };
  //find user BY _id and Update
  await User.findOneAndUpdate(filter, update)
  .catch(err =>{
    res.status(201).json({
        message : "try again"
    })
  })
const updateduser =  await User.findOne(filter)
res.status(200).json({
    message : "user updated",
    updateduser
})


})

module.exports = Router;
