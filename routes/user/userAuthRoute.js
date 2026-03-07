const express = require("express")
const { register, login } = require("../../controllers/user/userAuthCtrl")

const router = express.Router()

router.route("/register").post(register)

router.route("/logIn").post(login)


module.exports = router


