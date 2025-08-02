import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"   // For Authentication
import bycryt from "bcrypt"   // For password encryption
import validator from "validator"
import { response } from "express";
import crypto from "crypto";
import 


//Login user

const loginUser = async(req ,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User doesn't exist"})
        }
        const isMatch = await bycryt.compare(password, user.password)

        if (!isMatch) {
            return res.json({success:false, message:"Invalid credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//Register user

const registerUser = async(req ,res)=>{
    const {name,password,email} = req.body;
    try {
        //Checking is user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,message:"User already exists for this mail"})
        }

        // Validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if (password.length<8) {
            return res.json({success:false, message:"Please enter a strong password"})
        }

        // Hashing user password
        const salt = await bycryt.genSalt(10);
        const hashedPassword = await bycryt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}



export {loginUser, registerUser}