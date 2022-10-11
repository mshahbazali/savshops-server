const mongoose = require("mongoose")
const brandSchema = mongoose.model("brand", mongoose.Schema({
    name: { type: String },
    image: { type: String, },
    category: { type: String, },
    cashback: { type: Number, },
    link: { type: String, },
    status: { type: String },
    description1: { type: String },
    description2: { type: String },
    description3: { type: String },
    description4: { type: String },
    description5: { type: String },
    description6: { type: String },
    description7: { type: String },
    description8: { type: String },
    description9: { type: String },
    description10: { type: String },

},
    { timestamps: true }

))





module.exports = brandSchema 