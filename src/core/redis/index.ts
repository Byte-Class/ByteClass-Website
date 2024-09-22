import { assert, error } from "console";
import { createClient } from "redis";

export const redisClient = createClient();

(async () => {
  await redisClient.connect();
})();

redisClient.on("ready", () => {
  console.log("Connected!");
});

redisClient.on("error", (err) => {
  assert(error !== undefined, err);
});
