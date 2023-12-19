import jwt from "jsonwebtoken"
import { User } from "../models/User.js";


export const isSignedInAdmin=async(req,res,next)=>{
let token;
if(req.headers){
    try {
        token=req.headers["x-auth-token"];
        if (!token) {
            return res.status(401).json({message:"You are not authenticated!"});
          }
        const decode=jwt.verify(token,process.env.SECRET_CODE_ADMIN)
        console.log(decode)
        req.user=await User.findById(decode.id).select("-password");
        next()
    } catch (error) {
      return res.status(401).json({message:"Invalid Authorization"})
    }
    if(!token){
        return res.status(400).json({message:"Access denied"})
    }
}
}

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }
  
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) return next(createError(403, "Token is not valid!"));
      req.user = user;
      next();
    });
  };

  