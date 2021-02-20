const express = require('express')
const authentification = require('./../auth/authentification')
const Router = express.Router();
const sharp = require('sharp'); 
const Room = require('./../modal/Room')
const upload = require('./../store/storage');


Router.get('/', async (req,res)=>{
    await Room.find({})
    .then(room=>{
        res.json({
            message : "room list",
            Rooms : room
        })
    }).catch(err=>{
        res.json({
            message : "error",
           
        })
    })
})


Router.get('/2', async (req,res)=>{
    await Room.find({}).limit(2)
    .then(room=>{
        res.json({
            message : "room list",
            Rooms : room
        })
    }).catch(err=>{
        res.json({
            message : "error",
           
        })
    })
})


Router.get('/:id', async (req,res)=>{
    const {id} = req.params
  const room =   await Room.findOne({_id : id})
  if(room){
    res.status(200).json({
        message : "room",
        Room : room
    })
  } else{
    res.status(201).json({
        message : "error",
    })
  }
    
})

Router.use(authentification)
Router.post('/add',upload.single("myImage"),async(req,res)=>{

    const {Title} = req.body
    const {Prix} = req.body
    const {nbr_pl} =req.body
    const {description} =req.body
    //  console.log(req.file)
    // console.log(req.hostname)

    if( Title === "" || Prix === "" || nbr_pl === "" || description === "" || req.file === "undefined"){
        res.status(201).json({
            message : "all field must be filled"
        })
    }
    
    const url =`http://${req.hostname}:3001/${req.file.filename}`
    const newRoom = new Room({
        Title : Title,
        Prix : Prix,
        nbr_pl : nbr_pl,
        description : description,
        image_url : url
    })
    
  await  newRoom.save()
   .then((room) =>{
    res.status(200).json({
        message : 'Room added',
        newroom : room   
    })
   })
   .catch(err=>{
       res.json({
           message : err
       })
   })
})




Router.put('/update/:id', async (req,res)=>{
    const {Title} = req.body
    const {Prix} = req.body
    const {nbr_pl} =req.body
    const {description} =req.body

      // Creating filer and storing new data
      const filter = { _id: req.params.id };
      const update = {
        Title :Title,
        Prix : Prix,
        nbr_pl : nbr_pl,
        description : description,
      };
      //find user BY _id and Update
      await Room.findOneAndUpdate(filter, update)
      .catch(err =>{
        res.status(201).json({
            message : "try again"
        })
      })
    const updatedroom =  await Room.findOne(filter)
    res.status(200).json({
        message : "Room updated",
        updatedroom : updatedroom
    })
    

})

Router.put('/update/images/:id',upload.single("myImage"), async (req,res)=>{
    
    console.log(req.body)
    console.log(req.file)
    const url =`http://${req.hostname}:3001/${req.file.filename}`
    const filter = { _id: req.params.id };
      const update = {
        image_url : url,
      };

      await Room.findOneAndUpdate(filter, update)
      .catch(err =>{
        res.status(201).json({
            message : "try again"
        })
      })
    const updatedroom =  await Room.findOne(filter)
    res.status(200).json({
        message : "image updated",
        updatedroom : updatedroom
    })


})


Router.delete('/:id', async (req,res)=>{

    const id = req.params.id
    const deletedroom = await Room.findOne({_id : id})
    if(!deletedroom) {
        res.status(201).json({
            message : "error"
        })
    }
     await Room.findOneAndDelete({_id : id})
     res.status(200).json({
         message : "Reservation deleted",
         Room_id : deletedroom._id
     })
})


// Router.post('/upload',(req,res)=>{
//     console.log(req.file)
//     res.send("ok")
// })




module.exports = Router;