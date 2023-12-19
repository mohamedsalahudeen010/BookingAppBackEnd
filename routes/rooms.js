import express from "express";
import { isSignedInAdmin } from "../controllers/authAdmin.js";
import { Hotel } from "../models/Hotel.js";
import { Room } from "../models/Room.js";


const router = express.Router();


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CREATE ROOM>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/:hotelid", isSignedInAdmin, async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json({message:"Room Successfully created",savedRoom});
  } catch (err) {
    console.log("error",err) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< UPDATE ROOM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.put("/availability/:id",async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({message:"Successfully Updated",updatedRoom});
  } catch (err) {
    console.log("error",err) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< UPDATE ROOM AVAILABILITY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.put("/:id", isSignedInAdmin, async (req, res) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json({message:"Room status has been updated."});
  } catch (err) {
    console.log("error",err) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DELETE ROOM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.delete("/:id/:hotelid", isSignedInAdmin,async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json({message:"Room has been deleted."});
  } catch (err) {
    console.log("error",err) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< GET ROOM>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/:id",async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if(!room){
      res.status(400).json({message:"Can not Get Rooms"});
    }
    res.status(200).json({message:"Successfull",room});
  } catch (err) {
    console.log("error",err) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< GET ALL ROOMS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/",async (req, res, next) => {
  try {
    const rooms = await Room.find();
    
    if(!rooms){
      res.status(400).json({message:"Can not Get Hotel Rooms"});
    }
    res.status(200).json({message:"Successfull",rooms});
  } catch (err) {
    console.log("error",err) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

export const roomsRoute= router;