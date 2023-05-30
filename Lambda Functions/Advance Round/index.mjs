import { Redis } from "@upstash/redis"

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
    let highestHash = {};
    let countedAnswers = 0;
    
    if(highestAnswers != "null")
    {
        for(let i = 0; i < highestAnswers.length; i+=2){
            highestHash[`${highestAnswers[i]}`] = highestAnswers[i + 1];
            if(highestAnswers[i+1] = highestAnswers[1]) countedAnswers++;
        }
    }
    
    // const chosenAnswers = parsed.chosenAnswers;
    // let chosenHash = {};

    // if(chosenAnswers != "null")
    // {
    //     for(let i = 0; i < chosenAnswers.length; i+=2){
    //         chosenHash[`${chosenAnswers[i]}`] = chosenAnswers[i + 1];
    //     }
    // }

    const response = {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': 'https://herd-word-qx25ygijz-peculiarnewbie.vercel.app/',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: JSON.stringify(advanceRound)
      };


    
    return response
}