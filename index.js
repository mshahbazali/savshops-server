const express = require("express")
const app = express()
const http = require("http").createServer(app)
require("dotenv").config()
const bodyParser = require('body-parser')
app.use(express.json())
app.use(require("cors")())
app.use(express.json())
app.use(bodyParser.json())
const port = process.env.PORT

// DATABASE CONNECT 
require("./src/db")

// Api 

app.use("/api/auth", require("./src/routes/auth"))
app.use("/api/brand", require("./src/routes/brand"))
app.use("/api/category", require("./src/routes/category"))

http.listen(port, () => {
    console.log(`Server is running on ${port}`)
})


