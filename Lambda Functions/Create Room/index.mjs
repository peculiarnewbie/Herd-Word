import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})

export const handler = async (event, context) => {
    const roomId = event.roomId;
    const userId = event.userId;
    
    console.log({roomId, userId})

    const keys = [`herdword:${roomId}`, `herdword:${roomId}:players`];
	const args = ["cRound", `${userId}`]

    const createRoom = await redis.eval(
        `
        local function checkPlayer(name)
            local exist = redis.call('ZSCORE', KEYS[2], name)
            return exist
        end

        local roomInfo = redis.call('HGET', KEYS[1], ARGV[1])

        if not roomInfo then
            redis.call('HSET', KEYS[1], "id", ARGV[1], "cRound", 0)
            redis.call('ZADD', KEYS[2], 0, ARGV[2])
            return {"created new room", "null"}
        elseif roomInfo == '0' then
            local exist = checkPlayer(ARGV[2])
            if not exist then
                redis.call('ZADD', KEYS[2], 0, ARGV[2])
                local players = redis.call('ZRANGE', KEYS[2], 0, -1)
                return {"joined the room", players}
            else
                return {"change name pls", "someone got there first"}
            end
        else
            --check for hot joining
            return {"room is playing", roomInfo}
        end`,
        keys,
        args
    );

    console.log("we here", createRoom);

    const response = {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // replace with hostname of frontend (CloudFront)
          "Access-Control-Allow-Credentials": true, 
        },
        body: createRoom
      };
    
    return response
}