const express = require("express");
const { authenticationUser } = require("../../middleware/userAuthentication");
const { getAllProjects, getProject } = require("../../controllers/admin_manager/projectCtrl");

const router = express.Router();

//======== get all projects route  ==========

router.route("/").get(authenticationUser, getAllProjects);

//========= get single project route ===========

router.route("/:id").get(authenticationUser, getProject);

module.exports = router;
