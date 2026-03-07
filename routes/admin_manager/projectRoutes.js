const express = require("express");
const {
  authorizationManagerAdmin,
  authenticationUser,
} = require("../../middleware/userAuthentication");
const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  assignUsers,
} = require("../../controllers/admin_manager/projectCtrl");
const router = express.Router();




//======== create project route  ==========

router
  .route("/")
  .post(authenticationUser, authorizationManagerAdmin, createProject);

//======== get all projects route  ==========

router
  .route("/")
  .get(authenticationUser, authorizationManagerAdmin, getAllProjects);

//========= get single project route ===========

router
  .route("/:id")
  .get(authenticationUser, authorizationManagerAdmin, getProject);

//============ update project route ===========

router
  .route("/:id")
  .put(authenticationUser, authorizationManagerAdmin, updateProject);

//============ delete project route ===========

router
  .route("/:id")
  .delete(authenticationUser, authorizationManagerAdmin, deleteProject);

//============ assign project to user route ===========

router
  .route("/assign/:id")
  .put(authenticationUser, authorizationManagerAdmin, assignUsers);

module.exports = router;


