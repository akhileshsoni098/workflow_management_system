const redis = require("../config/redis");

module.exports = async (projectId) => {
  // all project detail caches
  const projectKeys = await redis.keys(`project:*:${projectId}`);

  if (projectKeys.length) {
    await redis.del(projectKeys);
  }

  // list caches
  const listKeys = await redis.keys("projects:*");

  if (listKeys.length) {
    await redis.del(listKeys);
  }
};
