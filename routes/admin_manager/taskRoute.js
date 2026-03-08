const express = require("express")
const { authenticationUser, authorizationManagerAdmin } = require("../../middleware/userAuthentication")
const { createTask, getTasksByProject, updateTask, changeTaskStatus, deleteTask } = require("../../controllers/admin_manager/taskCtrl")

const router = express.Router()

//======================= create Task by ProjectId =============================

router.route("/:id").post(authenticationUser,authorizationManagerAdmin,createTask)

//======================= Tasks by ProjectId ===================================

router.route("/:id").get(authenticationUser,authorizationManagerAdmin,getTasksByProject)

//======================= update task by taskId ===============================

router.route("/:id").put(authenticationUser,authorizationManagerAdmin,updateTask)

//===================== update status of Task by taskId =======================

router.route("/status/:id").put(authenticationUser,authorizationManagerAdmin,changeTaskStatus)

//====================  Delete Task by TaskId ==================================

router.route("/:id").delete(authenticationUser,authorizationManagerAdmin,deleteTask)


module.exports = router



