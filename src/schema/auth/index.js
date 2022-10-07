const mongoose = require("mongoose")
const authSchema = mongoose.model("auth", mongoose.Schema({
    name: { type: String },
    email: { type: String, },
    password: { type: String, },
    gender: { type: String, },
    country: { type: String, },
    mobile: { type: String },
    profileImage: { type: String },
    verify: { type: Boolean },
    referralCode: { type: String },
    totalreferral: { type: Number },
    lifeTimeEarning: { type: Number },
    totalEarning: { type: Number },
    pendingEarning: { type: Number },
},
    { timestamps: true }

))

const otpSchema = mongoose.model("otp", mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    OTP: {
        type: String,
    },
    purpose: {
        type: String,
    },
},
    { timestamps: true }
))




module.exports = { authSchema, otpSchema }