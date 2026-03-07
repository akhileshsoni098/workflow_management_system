const express = require("express");
const {
  authorizationManagerAdmin,
  authenticationUser,
} = require("../../middleware/userAuthentication");
const { getAllUsers } = require("../../controllers/user/userAuthCtrl");

const router = express.Router()


router.route("/").get(authenticationUser, authorizationManagerAdmin,getAllUsers)


module.exports = router

