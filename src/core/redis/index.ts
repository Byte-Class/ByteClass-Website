import { assert, error } from "console";
import { createClient } from "redis";

export const redisClient = createClient();

(async () => {
  await redisClient.connect();
})();

redisClient.on("error", (err) => {
  assert(error !== undefined, err);
});
