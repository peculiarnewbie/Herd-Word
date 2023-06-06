import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})


export const handler = async (event, context) => {
    const roomId = event.roomId;
    const userId = event.userId;
    const hotJoinable = event.hotJoinable;
    const params = event.params;
    
    console.log({roomId, userId, hotJoinable, params})

    const keys = [`herdword:${roomId}`, `herdword:${roomId}:players`];
	const args = [`${roomId}`, `${userId}`, hotJoinable, params ]

    const createRoom = await redis.eval(
        `
            redis.call('HELLO', '3')    

            local room = redis.call('HSET', KEYS[1], 'id', ARGV[1], 'round', '0', 'roomMaster', ARGV[2], 'hotJoinable', ARGV[3], 'params', ARGV[4])
            redis.call('ZADD', KEYS[2], 0, ARGV[2])

            return redis.call('HGETALL', KEYS[1])

        `,
        keys,
        args
    );

    console.log("we here", createRoom);

    const parsed = JSON.parse(JSON.stringify(createRoom));

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