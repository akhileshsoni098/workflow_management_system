const redis = require("./config/redis");

(async () => {

  await redis.set("testKey", "Hello_Akhil");

  const data = await redis.get("testKey");

  console.log("Redis Test Value:", data);

})();