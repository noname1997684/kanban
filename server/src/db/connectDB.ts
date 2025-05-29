import mongoose from 'mongoose';


const connectDB = async () => {
    try{
    const connect= await mongoose.connect(process.env.MONGO_DB_URI || '') 
    console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error){
        if (error instanceof Error) {
            console.log(`Error: ${error.message}`);
        } else {
            console.log(`Error: ${String(error)}`);
        }
        process.exit(1);
    }
}

export default connectDB