const mongoose = require("mongoose")
const requestSchema = mongoose.model("request", mongoose.Schema({
    brandName: { type: String },
    userId: { type: String },
    orderDate: { type: String },
    orderTime: { type: String },
    orderNumber: { type: String },
    purchaseAmount: { type: String },
    status: { type: String },
},
    { timestamps: true }

))


module.exports = requestSchema 