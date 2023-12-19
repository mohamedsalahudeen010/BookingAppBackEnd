import express from "express";


import { isSignedInAdmin } from "../controllers/authAdmin.js";
import {Hotel} from "../models/Hotel.js"
import { Room } from "../models/Room.js";
// import {verifyAdmin} from "../utils/verifyToken.js"

const router = express.Router();

//CREATE
// router.post("/", verifyAdmin, createHotel);

// //UPDATE
// router.put("/:id", verifyAdmin, updateHotel);
// //DELETE
// router.delete("/:id", verifyAdmin, deleteHotel);
// //GET

// router.get("/find/:id", getHotel);
// //GET ALL

// router.get("/", getHotels);
// router.get("/countByCity", countByCity);
// router.get("/countByType", countByType);
// router.get("/room/:id", getHotelRooms);


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CREATE HOTEL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/", isSignedInAdmin,async (req, res) => {
  try {
    const savedHotel = await new Hotel(req.body).save();
    res.status(200).json(savedHotel);
  } catch (error) {
    console.log("error",error) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Update HOTEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.put("/:id", isSignedInAdmin, async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (error) {
    console.log("error",error) 
       return res.status(500).json({message:"Internal Server Error"}) 
  }
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Delete HOTEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.delete("/:id", isSignedInAdmin,async (req, res) => {
  try {
    const deleteHotel=await Hotel.findByIdAndDelete(req.params.id);
    if(!deleteHotel){return res.status(400).json({message:"Couldn'nt delete Hotel"})}
    res.status(200).json("Hotel has been deleted.");
  } catch (error) {
    console.log("error",error) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  GET HOTEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.get("/find/:id",async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if(!hotel){
      res.status(400).json({message:"Can not Get Hotel"});
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.log("error",error) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }

})

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  GET ALL HOTELS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/",async (req, res) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min | 0, $lt: max || 10000 },
    });
    if(!hotels){
      res.status(400).json({message:"Can not Get Hotels"});
    }
    res.status(200).json(hotels);
  } catch (error) {
    console.log("error",error) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  GET ALL HOTELS BY CITY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/countByCity",async (req, res) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    if(!list){
      res.status(400).json({message:"Can not Get Hotels"});
    }
    res.status(200).json(list);
  } catch (error) {
    console.log("error",error) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  GET ALL HOTELS BY TYPE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/countByType",async (req, res) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (error) {
    console.log("error",error) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  GET HOTEL ROOMS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/room/:id" ,async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if(!hotel){
      res.status(400).json({message:"Can not Get Hotels"});
    }
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    if(!list){
      res.status(400).json({message:"Can not Get Hotel Rooms"});
    }
    res.status(200).json(list)
  } catch (error) {
    console.log("error",error) 
    return res.status(500).json({message:"Internal Server Error"}) 
  }
});

export const hotelsRoute= router;