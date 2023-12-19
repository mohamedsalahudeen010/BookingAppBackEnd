
import express from "express";
import bcrypt from "bcrypt"

import { Admin, genAdminAuthToken } from "../models/Admin.js";
import { User, genUserAuthToken } from "../models/User.js";


const router = express.Router();




//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< USER AUTH >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< USER REGISTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/user/register", async (req, res) => {
    try {
        let user= await User.findOne({email:req.body.email})
        if(user){return res.status(409).json({message:"Email Already Exist"})}
        
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        user = await new User({
            ...req.body,
         password:hashedPassword,
        }).save()
        return res.status(200).json({message:"SignedUp Successfully"})
     } catch (error) {
       console.log("error",error) 
       return res.status(500).json({message:"Internal Server Error"}) 
     }
  });

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< USER LOGIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 router.post("/user/login",async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
    
        if (!user) {
          return res.status(404).json({ message: "invalid credentials email" });
        }
    
        const passwordValidate = await bcrypt.compare(
          req.body.password,
          user.password
        );
       
        console.log(passwordValidate);
        if (!passwordValidate) {
          return res.status(404).json({ message: "invalid credentials password" });
        }
        const authUserToken = genUserAuthToken(user.id);
    
        console.log("authToken",authUserToken)
    
        return res
          .status(200)
          .json({
            message: "User logged in successfully",
            token: authUserToken,
            user,
          });
    
         
    
      } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
  });



  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ADMIN AUTH >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ADMIN REGISTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post("/admin/register", async (req, res) => {
    try {
        let admin= await Admin.findOne({email:req.body.email})
        if(admin){return res.status(409).json({message:"Email Already Exist"})}
        
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        admin = await new Admin({
            ...req.body,
         password:hashedPassword,
        }).save()
        return res.status(200).json({message:"SignedUp Successfully"})
     } catch (error) {
       console.log("error",error) 
       return res.status(500).json({message:"Internal Server Error"}) 
     }
  });

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ADMIN LOGIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 router.post("/admin/login",async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
    
        if (!admin) {
          return res.status(404).json({ message: "invalid credentials email" });
        }
    
        const passwordValidate = await bcrypt.compare(
          req.body.password,
          admin.password
        );
       
        console.log(passwordValidate);
        if (!passwordValidate) {
          return res.status(404).json({ message: "invalid credentials password" });
        }
        const authAdminToken = genAdminAuthToken(admin.id);
    
        console.log("authToken",authAdminToken)
    
        return res
          .status(200)
          .json({
            message: "Admin logged in successfully",
            token: authAdminToken,
            admin,
          });
    
         
    
      } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
  });


export const authRoute=router