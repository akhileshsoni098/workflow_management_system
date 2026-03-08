const express = require("express")
const { getTasksByProject } = require("../../controllers/admin_manager/taskCtrl")
const { authenticationUser } = require("../../middleware/userAuthentication")


const router = express.Router()

//======================= Tasks by ProjectId ===================================

router.route("/:id").get(authenticationUser,getTasksByProject)

module.exports = router