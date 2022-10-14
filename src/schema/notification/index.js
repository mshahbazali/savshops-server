const mongoose = require("mongoose")
const notificationSchema = mongoose.model("notification", mongoose.Schema({
    userId: { type: String },
    title: { type: String },
    content: { type: String },
    status: { type: String },
    type: { type: String },
},
    { timestamps: true }

))


module.exports = notificationSchema