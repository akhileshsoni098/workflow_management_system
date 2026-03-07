const express = require("express")

const user = express()

const userAuthRoute = require("../routes/user/userAuthRoute")

user.use("/user",userAuthRoute)


module.exports = user