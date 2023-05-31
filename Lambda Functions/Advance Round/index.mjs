import { Redis } from "@upstash/redis"
import Ably from 'ably'

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})


export const handler = async (event, context) => {
    const roomId = event.roomId;
    const round = event.round;

    const chosenAnswerCount = 2;
    
    console.log({roomId, round})

    const keys = [`herdword:${roomId}`, 
    `herdword:${roomId}:${round}:inputs`,
    `herdword:${roomId}:${round}:playerinputs`,
    `herdword:${roomId}:${round}:inputRank`];
	const args = [round, chosenAnswerCount]

    const advanceRound = await redis.eval(
        `
        local currentRound = redis.call('HINCRBY', KEYS[1], 'cRound', 1)
        
        if ARGV[1] == '0' then
            
            return '{"cRound": ' .. currentRound .. ', "chosenAnswers": "null", "highestAnswers": "null"}'
        elseif ARGV[1] == '1' then
            --use this later to reveal who input the answers
            --local chosenAnswers = redis.call('ZRANDMEMBER', KEYS[3], ARGV[2], 'WITHSCORES')
            local chosenAnswers = redis.call('HRANDFIELD', KEYS[2], ARGV[2], 'WITHVALUES')
            local chosenString = table.concat(chosenAnswers, '", "')
            return '{"cRound": ' .. currentRound .. ', "chosenAnswers": ["' .. chosenString .. '"], "highestAnswers": "null" }'
        else
            local highestAnswers = redis.call('ZREVRANGE', KEYS[4], '0', '2', 'WITHSCORES')
            local highestString = table.concat(highestAnswers, '", "')
            local chosenAnswers = redis.call('ZRANGE', KEYS[4], '0', '1', 'WITHSCORES')
            local chosenString = table.concat(chosenAnswers, '", "')
            return '{"cRound": ' .. currentRound .. ', "chosenAnswers": ["' .. chosenString .. '"], "highestAnswers": ["' .. highestString .. '"]}'
        end`,
        keys,
        args
    );

    console.log("we here", advanceRound);

    const parsed = JSON.parse(JSON.stringify(advanceRound));

    const highestAnswers = parsed.highestAnswers;
    let highestArr = [];
    const chosenAnswers = parsed.chosenAnswers;
    let chosenArr = [];
    
    if(highestAnswers != "null")
    {
        for(let i = 0; i < highestAnswers.length; i+=2){
            let counts = false
            if(highestAnswers[i+1] = highestAnswers[1]) counts = true;
            let obj = {input: highestAnswers[i], score: highestAnswers[i + 1], counts: counts}
            highestArr.push(obj);
        }
    }

    if(chosenAnswers != "null"){
        for(let i = 0; i < chosenAnswers.length; i+=2){
            chosenArr.push(chosenAnswers[i+1]);
        }
    }


    let JSONResponse = {cRound: parsed.cRound,
                        chosenAnswers: chosenArr,
                        highestAnswers: highestArr}
    
    const ably = new Ably.Realtime.Promise(process.env.HERD_ABLY_API_KEY)
    await ably.connection.once('connected');
    const channel = ably.channels.get(`herdword:${roomId}`);
    await channel.publish(`:actions`, JSON.stringify(JSONResponse));
    console.log("published")
    ably.close()

    const response = {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': 'https://herd-word-qx25ygijz-peculiarnewbie.vercel.app/',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: JSON.stringify(advanceRound)
      }

    return response
}