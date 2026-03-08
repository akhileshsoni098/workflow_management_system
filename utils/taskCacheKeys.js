exports.tasksByProjectKey = (user, projectId, query) => {
  const { status = "all", priority = "all" } = query;

  return `tasks:${projectId}:${user.role}:${user._id}:status:${status}:priority:${priority}`;
};