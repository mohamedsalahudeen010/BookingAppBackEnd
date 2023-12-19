import jwt from "jsonwebtoken"
import { User } from "../models/User.js";


const isSignedInUser = async(req, res, next) => {
    let token; 
    if (req.headers){
    try {
         token = req.headers["x-auth-token"]; 
         if(!token) return res.status(400).json({message:"Access denied"});

         if(token){
            const decode = jwt.verify(token, process.env.SECRET_CODE_USER); 
         console.log(decode)
         req.user = await User.findById(decode.id).select("-password")
         
         next();
         }
         
         
       }
     catch (error) {
      return res.status(401).json({message: "Invalid Authorization"})
    }
 }
 
 
 }
 
 export {isSignedInUser}


