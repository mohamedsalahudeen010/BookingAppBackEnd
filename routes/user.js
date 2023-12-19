import express from "express";
import { isSignedInUser } from "../controllers/authUser.js";
import { User } from "../models/User.js";


const router = express.Router();


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< UPDATE USER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.put("/:id",isSignedInUser, async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DELETE USER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.delete("/:id",isSignedInUser, async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< GET USER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/:id",isSignedInUser,async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< GET ALL USERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/", isSignedInUser,async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

export const usersRoute= router;