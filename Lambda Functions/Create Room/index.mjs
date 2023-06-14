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

    const keys = [`herdword:${roomId}`, `herdword:${roomId}:players`, `herdword:${roomId}:questionsunion`, `herdword:${roomId}:questions`];
	const args = [`${roomId}`, `${userId}`, hotJoinable, params]

    const createRoom = await redis.eval(
        `  
            local function shuffle(tab)
                local len = #tab
                local r
                for i = 1, len do
                    r = math.random(i, len)
                    tab[i], tab[r] = tab[r], tab[i]
                end
            end

            local room = redis.call('HSET', KEYS[1], 'id', ARGV[1], 'round', '0', 'roomMaster', ARGV[2], 'hotJoinable', ARGV[3], 'params', ARGV[4])
            redis.call('ZADD', KEYS[2], 0, ARGV[2])

            local params = cjson.decode(ARGV[4])
            local gameType = params.gameType

            if gameType == 'herd' then
                local questions = params.questionSets
                local questionKeys = {}

                for i, v in ipairs(questions) do
                    questionKeys[i] = 'herdword:questions:' .. questions[i]
                    print(i, v)
                end

                redis.call('SUNIONSTORE', KEYS[3], unpack(questionKeys))

                local randQuestions = redis.call('SRANDMEMBER', KEYS[3], params.endTarget)

                local chosenQuestions = {}
                local iter = 1

                shuffle(randQuestions)

                for i, v in ipairs(randQuestions) do
                    chosenQuestions[iter] = i
                    chosenQuestions[iter+1] = randQuestions[i]
                    iter = iter + 2
                end

                redis.call('HSET', KEYS[4], unpack(chosenQuestions))

                return {randQuestions, chosenQuestions}
                
            end

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