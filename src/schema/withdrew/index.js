const mongoose = require("mongoose")
const withdrewSchema = mongoose.model("withdrew", mongoose.Schema({
    registeredEmail: { type: String },
    fullName: { type: String },
    userId: { type: String },
    country: { type: String },
    region: { type: String },
    city: { type: String },
    postcode: { type: String },
    address: { type: String },
    amount: { type: String },
    status: { type: String },
    method: { type: String },
},
    { timestamps: true }

))


module.exports = withdrewSchema 