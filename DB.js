import mongoose from "mongoose"

const dbConnection=()=>{
    const params={
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
    try {
        mongoose.connect(process.env.MONGO_URL,params)
        console.log("Db Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

export default dbConnection