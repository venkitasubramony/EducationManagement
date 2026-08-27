import mongoose from "mongoose";

 const connectDB = async() => {    
    
    try{
       await mongoose.connect(process.env.MONGODBURI);
       console.log('DB connected');
    }
    catch(err){
        console.log(`Moongo DB connection failed`);
        process.exit(1);

    }
}
export default connectDB;