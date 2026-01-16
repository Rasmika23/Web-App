import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://tastio:tastio123@cluster0.tzso1ae.mongodb.net/webapp').then(() => console.log("DB Connected"));
}

