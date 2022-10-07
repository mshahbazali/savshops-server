const mongoose = require("mongoose")
const categorySchema = mongoose.model("category", mongoose.Schema({
    name: { type: String },
    icon: { type: String, },
    totalBrand: { type: Number, },
    status: { type: String }

},
    { timestamps: true }

))





module.exports = categorySchema 