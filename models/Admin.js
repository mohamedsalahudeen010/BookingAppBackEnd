import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema(
  {
    adminname: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const genAdminAuthToken=(id)=>{
    return jwt.sign({id},process.env.SECRET_CODE_ADMIN)
}



const Admin = mongoose.model("Admin", adminSchema);

export{Admin,genAdminAuthToken}