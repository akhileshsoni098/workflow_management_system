exports.projectsListKey = (user, query) => {
  const { page = 1, limit = 10, name = "all", assignedUser = "all" } = query;

  return `projects:${user.role}:${user._id}:name:${name}:assigned:${assignedUser}:page:${page}:limit:${limit}`;
};

exports.projectDetailsKey = (user, projectId) => {
  return `project:${user.role}:${user._id}:${projectId}`;
};

