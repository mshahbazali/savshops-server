const mongoose = require("mongoose")
const savedSchema = mongoose.model("saved", mongoose.Schema({
    userId: { type: String },
    brandId: { type: String },
},
    { timestamps: true }

))

module.exports = savedSchema 