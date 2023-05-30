import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})

export const handler = async (event, context) => {
    const roomId = event.roomId;
    const userId = event.userId;
    const fromCookie = event.fromCookie
    
    console.log({roomId, userId, fromCookie})

    const keys = [`herdword:${roomId}`, `herdword:${roomId}:players`];
	const args = ["cRound", `${userId}`, fromCookie]

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
            return '{"code": 101, "message": "created new room", "players": ["' .. ARGV[2] .. '"]}'
        elseif roomInfo == '0' then
            local exist = checkPlayer(ARGV[2])
            if exist and not ARGV[3]  then
                return '{"code": 104, "message":"name exists in room", "players": "null"}'
            else
                redis.call('ZADD', KEYS[2], 0, ARGV[2])
                local players = redis.call('ZRANGE', KEYS[2], 0, -1)
                local playersString = table.concat(players, '", "')
                
                if exist then
                    return '{"code": 103, "message": "Welcome Back", "players": ["' .. playersString .. '"]}'
                else
                    return '{"code": 102, "message": "Joined Room", "players": ["' .. playersString .. '"]}'
                end
            end
        else
            --check for hot joining
            return '{"code": 105, "message":"room is playing", "players": "null"}'
        end`,
        keys,
        args
    );

    console.log("we here", createRoom);

    const response = {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': 'https://herd-word-qx25ygijz-peculiarnewbie.vercel.app/',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: createRoom
      };
    
    return response
}