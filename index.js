const express = require("express")
const app = express()
const http = require("http").createServer(app)
require("dotenv").config()
const bodyParser = require('body-parser')
app.use(express.json())
app.use(require("cors")())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT

// DATABASE CONNECT 
require("./src/db")

// Api 

app.use("/api/auth", require("./src/routes/auth"))
app.use("/api/brand", require("./src/routes/brand"))
app.use("/api/category", require("./src/routes/category"))
app.use("/api/visit", require("./src/routes/visit"))
app.use("/api/request", require("./src/routes/request"))
app.use("/api/withdrew", require("./src/routes/withdrew"))
app.use("/api/saved", require("./src/routes/saved"))
app.use("/api/notification", require("./src/routes/notification"))
app.use("/api/upload", require("./src/routes/upload"))

http.listen(port, () => {
    console.log(`Server is running on ${port}`)
})


