import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"   // For Authentication
import bycryt from "bcrypt"   // For password encryption
import validator from "validator"
import { response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";



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

// forgot password
const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

// Generate reset token

const resetToken = crypto.randomBytes(32).toString("hex");
const resetTokenExpiry = Date.now() + 3600000; // 1 hour

//save token to user
user.resetToken = resetToken;
user.resetTokenExpiry = resetTokenExpiry;
await user.save();

//set up nodemailer 

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email content
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Password reset email sent" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    
    try {
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash new password
        const salt = await bycryt.genSalt(10);
        const hashedPassword = await bycryt.hash(newPassword, salt);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error resetting password" });
    }
};

export {loginUser, registerUser, forgotPassword, resetPassword}