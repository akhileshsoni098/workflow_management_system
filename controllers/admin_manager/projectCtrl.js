/* 
Create Project
Get All Projects
Get Project Details
Assign Users to Project
Update Project
Delete Project
*/

const Project = require("../../models/projectModel");
const { isValidObjectId } = require("mongoose");
const User = require("../../models/userModel");
const Activity = require("../../models/activityLogModel");
const redis = require("../../config/redis");
const {
  projectsListKey,
  projectDetailsKey,
} = require("../../utils/projectCacheKey");
const clearProjectCache = require("../../utils/clearProjectCache");

// function to validate assigned users

const assignUsers = async (assignedUsers) => {
  if (!Array.isArray(assignedUsers)) {
    return {
      status: false,
      message: "Assigned users must be an array of user IDs",
    };
  }
  for (let userId of assignedUsers) {
    if (!isValidObjectId(userId)) {
      return { status: false, message: `Invalid user ID: ${userId}` };
    }
  }
  const existingUsers = await User.find({ _id: { $in: assignedUsers } });
  if (existingUsers.length !== assignedUsers.length) {
    return { status: false, message: "One or more assigned users not found" };
  }

  return { status: true };
};

//========================== project creation ==========================

exports.createProject = async (req, res) => {
  try {
    const { name, description, assignedUsers } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ status: false, message: "Project name is required" });
    }

    if (description && typeof description !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Description must be a string" });
    }

    if (assignedUsers) {
      const validationResult = await assignUsers(assignedUsers);
      if (!validationResult.status) {
        return res.status(400).json(validationResult);
      }
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      assignedUsers: assignedUsers || [],
    });

    //=============== activity ============
    await Activity.create({
      userId: req.user._id,
      actionType: "PROJECT_CREATED",
      entityType: "Project",
      entityId: project._id,
    });

    const io = req.app.get("io");

    io.emit("projectCreated", project);

    await clearProjectCache(project._id);

    return res.status(201).json({
      status: true,
      message: "Project Created Successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//========================== Get All Projects ==========================

exports.getAllProjects = async (req, res) => {
  try {
    // redis
    const cacheKey = projectsListKey(req.user, req.query);

    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("cache hit");
      return res.json(JSON.parse(cached));
    }

    const { page = 1, limit = 10, name, assignedUser } = req.query;
    const query = {};

    // filter by name

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // emp only see assigned projects
    if (req.user.role === "Employee") {
      query.assignedUsers = req.user._id;
    }

    // manager ya phir  admin can filter by assigned user
    if (
      (req.user.role === "Manager" || req.user.role === "Admin") &&
      assignedUser
    ) {
      query.assignedUsers = assignedUser;
    }

    const projects = await Project.find(query)
      .populate("createdBy", "name email")
      .populate("assignedUsers", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    const response = {
      status: true,
      data: projects,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    console.log("cache miss");

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//========================== Get Project Details ==========================
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid project ID" });
    }

    // redis
    const cacheKey = projectDetailsKey(req.user, id);

    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("cache hit");
      return res.json(JSON.parse(cached));
    }
    const project = await Project.findById(id)
      .populate("createdBy", "name email")
      .populate("assignedUsers", "name email");

    if (!project)
      return res
        .status(404)
        .json({ status: false, message: "Project not found" });

    if (
      req.user.role === "Employee" &&
      !project.assignedUsers.some((userId) => userId.equals(req.user._id))
    ) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const activitiesDetails = await Activity.find({
      entityId: id,
      entityType: "Project",
    }).sort({ createdAt: -1 });

    const response = {
      status: true,
      data: project,
      activities: activitiesDetails,
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    console.log("cache miss");

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//========================== Update Project ==========================
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid project ID" });
    }

    const { name, description, assignedUsers } = req.body;

    if (name && name.trim() === "") {
      return res
        .status(400)
        .json({ status: false, message: "Project name cannot be empty" });
    }

    if (description && typeof description !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Description must be a string" });
    }

    if (assignedUsers) {
      const validationResult = await assignUsers(assignedUsers);
      if (!validationResult.status) {
        return res.status(400).json(validationResult);
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, assignedUsers },
      { returnDocument: "after" },
    );
    if (!project)
      return res
        .status(404)
        .json({ status: false, message: "Project not found" });

    // activity log update

    await Activity.create({
      userId: req.user._id,
      actionType: "PROJECT_UPDATED",
      entityType: "Project",
      entityId: project._id,
    });

    const io = req.app.get("io");

    io.emit("projectUpdated", project);

    await clearProjectCache(project._id);

    res.status(200).json({
      status: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
//========================== Delete Project ==========================

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project)
      return res
        .status(404)
        .json({ status: false, message: "Project not found" });

    // activity log delete

    await Activity.create({
      userId: req.user._id,
      actionType: "PROJECT_DELETED",
      entityType: "Project",
      entityId: project._id,
    });

    const io = req.app.get("io");

    io.emit("projectDeleted", {
      projectId: id,
      name: project.name,
    });

    await clearProjectCache(project._id);

    res.json({ status: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//========================== Assign Users to Project ==========================

exports.assignUsers = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid project ID" });
    }

    const { userIds } = req.body;

    if (!userIds) {
      return res.status(400).json({
        status: false,
        message: "userIds is required",
      });
    }

    const validationResult = await assignUsers(userIds);
    if (!validationResult.status) {
      return res.status(400).json(validationResult);
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { assignedUsers: { $each: userIds } } },
      { returnDocument: "after" },
    );

    // activity log for assigning users to project

    await Activity.create({
      userId: req.user._id,
      actionType: "PROJECT_USERS_ASSIGNED",
      entityType: "Project",
      entityId: project._id,
    });

    const io = req.app.get("io");

    io.emit("projectUsersAssigned", project);

    await clearProjectCache(project._id);

    res.status(200).json({
      status: true,
      message: "Users assigned to project successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
