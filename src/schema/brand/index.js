const mongoose = require("mongoose")
const brandSchema = mongoose.model("brand", mongoose.Schema({
    name: { type: String },
    image: { type: String, },
    category: { type: String, },
    cashback: { type: Number, },
    link: { type: String, },
    status: { type: String }

},
    { timestamps: true }

))





module.exports = brandSchema 