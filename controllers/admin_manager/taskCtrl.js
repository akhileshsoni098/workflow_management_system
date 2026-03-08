const { isValidObjectId } = require("mongoose");
const Activity = require("../../models/activityLogModel");
const Project = require("../../models/projectModel");
const Task = require("../../models/taskModel");

//=========================== create Task ======================

exports.createTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ProjectId" });
    }

    const { title, description, assignedUser, priority, status, dueDate } =
      req.body;

    const project = await Project.findById(id);

    if (!project)
      return res
        .status(404)
        .json({ satus: false, message: "Project not found" });

    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ status: false, message: "Task title is required" });
    }

    if (
      description &&
      (description.trim() == "" || typeof description !== "string")
    ) {
      return res.status(400).json({
        status: false,
        message: "Description must be a non empty string",
      });
    }

    if (assignedUser) {
      if (!isValidObjectId(assignedUser)) {
        return res.status(400).json({
          status: false,
          message: "Provide valid User to assign for this task",
        });
      }
      if (
        !project.assignedUsers.some((user) => user.toString() === assignedUser)
      ) {
        return res.status(400).json({
          status: false,
          message: `User is not assigned to this ${project.name} project`,
        });
      }
    }

    const validPriority = ["Low", "Medium", "High"];
    const validStatus = ["Todo", "In Progress", "Review", "Completed"];

    if (priority && !validPriority.includes(priority)) {
      return res.status(400).json({
        status: false,
        message: `Provide valid priority ${validPriority.join(" | ")}`,
      });
    }

    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        status: false,
        message: `Provide valid status ${validStatus.join(" | ")}`,
      });
    }

    if (dueDate) {
      const parsedDate = new Date(dueDate);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          status: false,
          message:
            'Invalid due date format. Please use "YYYY-MM-DD" (e.g., 2026-03-10)',
        });
      }

      if (parsedDate < new Date()) {
        return res.status(400).json({
          status: false,
          message: "Due date cannot be in the past",
        });
      }
    }

    const task = await Task.create({
      projectId: id,
      title,
      description,
      assignedUser,
      priority: priority || "Medium",
      status: status || "Todo",
      dueDate,
    });

    await Activity.create({
      userId: req.user._id,
      actionType: "TASK_CREATED",
      entityType: "Task",
      entityId: task._id,
    });

    const io = req.app.get("io");
    console.log("ProjectId", task.projectId);
    io.to(task.projectId.toString()).emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//========================= get Tasks by ProjectId =============

exports.getTasksByProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, priority } = req.query;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ProjectId",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    const filter = {
      projectId: id,
    };

    if (req.user.role === "Employee") {
      filter.assignedUser = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter)
      .populate("assignedUser", "name email")
      .sort({ createdAt: -1 });

    const now = new Date();

    const formattedTasks = tasks.map((task) => {
      let overDue = false;
      let days = 0;

      if (task.dueDate) {
        const due = new Date(task.dueDate);

        if (due < now && task.status !== "Completed") {
          overDue = true;

          const diffTime = now - due;

          days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }
      }

      return {
        ...task.toObject(),
        overDue,
        days,
      };
    });

    res.status(200).json({
      status: true,
      count: tasks.length,
      data: formattedTasks,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

//======================== update Task ==========================

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid TaskId",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    const { title, description, assignedUser, priority, status, dueDate } =
      req.body;

    const project = await Project.findById(task.projectId);
    if (!project)
      return res
        .status(404)
        .json({ satus: false, message: "Project not found" });

    // ===== Title  =====
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          status: false,
          message: "Task title must be a non empty string",
        });
      }

      task.title = title;
    }

    // ===== Description  =====
    if (description !== undefined) {
      if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({
          status: false,
          message: "Description must be a non empty string",
        });
      }

      task.description = description;
    }

    // ===== Assigned User  =====
    if (assignedUser !== undefined) {
      if (!isValidObjectId(assignedUser)) {
        return res.status(400).json({
          status: false,
          message: "Provide valid User to assign for this task",
        });
      }

      if (
        !project.assignedUsers.some((user) => user.toString() === assignedUser)
      ) {
        return res.status(400).json({
          status: false,
          message: `User is not assigned to project ${project.name}`,
        });
      }

      task.assignedUser = assignedUser;
    }

    const validPriority = ["Low", "Medium", "High"];
    const validStatus = ["Todo", "In Progress", "Review", "Completed"];

    // ===== Priority  =====
    if (priority !== undefined) {
      if (!validPriority.includes(priority)) {
        return res.status(400).json({
          status: false,
          message: `Provide valid priority ${validPriority.join(" | ")}`,
        });
      }

      task.priority = priority;
    }

    // ===== Status =====
    if (status !== undefined) {
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          status: false,
          message: `Provide valid status ${validStatus.join(" | ")}`,
        });
      }

      task.status = status;
    }

    // ===== Due Date  =====
    if (dueDate !== undefined) {
      const parsedDate = new Date(dueDate);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          status: false,
          message:
            'Invalid due date format. Please use "YYYY-MM-DD" (e.g., 2026-03-10)',
        });
      }

      task.dueDate = parsedDate;
    }

    await task.save();

    await Activity.create({
      userId: req.user._id,
      actionType: "TASK_UPDATED",
      entityType: "Task",
      entityId: task._id,
    });

    const io = req.app.get("io");
    io.to(task.projectId.toString()).emit("taskUpdated", task);

    res.status(200).json({
      status: true,
      data: task,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

//======================== update Task Status =========================

exports.changeTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid TaskId",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    const { status } = req.body;

    const validStatus = ["Todo", "In Progress", "Review", "Completed"];

    if (status !== undefined) {
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          status: false,
          message: `Provide valid status ${validStatus.join(" | ")}`,
        });
      }

      task.status = status;
    }

    await task.save();

    await Activity.create({
      userId: req.user._id,
      actionType: "TASK_STATUS_CHANGED",
      entityType: "Task",
      entityId: task._id,
    });

    const io = req.app.get("io");

    io.to(task.projectId.toString()).emit("taskStatusChanged", task);

    res.status(200).json({ status: true, data: task });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//================= delete Task ======================

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid TaskId",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task)
      return res.status(404).json({ status: false, message: "Task not found" });

    await Activity.create({
      userId: req.user._id,
      actionType: "TASK_DELETED",
      entityType: "Task",
      entityId: task._id,
    });

    const io = req.app.get("io");

    io.to(task.projectId.toString()).emit("taskStatusChanged", task);

    res.status(200).json({ status: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ ststus: false, message: err.message });
  }
};
