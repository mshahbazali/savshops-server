const mongoose = require("mongoose")
const visitSchema = mongoose.model("visit", mongoose.Schema({
    userId: { type: String },
    brandName: { type: String }

},
    { timestamps: true }

))


module.exports = visitSchema 