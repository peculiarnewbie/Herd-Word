import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})

export const handler = async (event, context) => {
    const roomId = event.roomId;

    const keys = [`herdword:${roomId}`];
	const args = ["id"]

    const createRoom = await redis.eval(
        `local roomInfo = redis.call('HGET', KEYS[1], ARGV[1])

        if roomInfo == nil then
            redis.call('HSET', KEYS[1], "id", ARGV[1], "currentRound", 0)
            return {"created new room", "null"}
        else
            return {"room already exist", roomInfo}
        end`,
        keys,
        args
    );

    console.log(createRoom[0]);
}