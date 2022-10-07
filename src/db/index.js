const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL).then((res) => {
    console.log(`DATABASE CONNECTED`)
}).catch((err) => {
    console.log(`DATABASE NOT CONNECTED`)
})