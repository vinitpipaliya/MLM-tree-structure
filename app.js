const express = require("express")
const bp = require("body-parser")
const mongoose = require("mongoose")
require('dotenv').config()

var app = express()
app.use(bp.json())

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB CONNECT")
}).catch((err) => {
    console.log("ERROR IN CONNECTION." + err)
})

const studentMlm = require("./Routes/studentRouting")

app.use('/', studentMlm)

app.listen(process.env.PORT, () => {
    console.log(`SERVER START -http://localhost:3000`)
})