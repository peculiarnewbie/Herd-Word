import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})


export const handler = async (event, context) => {
    const roomId = event.roomId;
    const userId = event.userId;
    const round = event.round;
    const input = event.input;
    
    console.log({roomId, userId, round, input})

    const keys = [`herdword:${roomId}:${round}:inputs`, `herdword:${roomId}:${round}:inputRank`, `herdword:${roomId}:${round}:playerinputs`];
	const args = [`${userId}`, `${input}`]

    const sendInput = await redis.eval(
        `
        local inputId = redis.call('HGET', KEYS[1], ARGV[2])
        if not inputId then
            local newId = redis.call('HLEN', KEYS[1])
            redis.call('HSET', KEYS[1], ARGV[2], newId) 
            inputId = newId
        end
        redis.call('ZADD', KEYS[3], inputId, ARGV[1])
        redis.call('ZINCRBY', KEYS[2], 1, inputId)

        return '{"inputId": ' .. inputId .. '}'
        `,
        keys,
        args
    );

    console.log("we here", sendInput);

    const response = {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': 'https://herd-word-qx25ygijz-peculiarnewbie.vercel.app/',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: sendInput
      };


    
    return response
}