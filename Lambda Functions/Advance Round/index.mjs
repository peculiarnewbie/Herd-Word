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
        
        local answers = redis.call('HGETALL', KEYS[2])
        local answersString = table.concat(answers, '", "')

        local playerInputs = redis.call('ZREVRANGE', KEYS[3], '0', '-1', 'WITHSCORES')
        local playersString = table.concat(playerInputs, '", "')

        if ARGV[1] == '0' then
        return '{"cRound": ' .. currentRound .. ', "answers": "null", "rankedAnswers": "null"}'
        else
            local highestAnswers = redis.call('ZREVRANGE', KEYS[4], '0', '-1', 'WITHSCORES')
            local highestString = table.concat(highestAnswers, '", "')
            return '{"cRound": ' .. currentRound .. ', "answers": ["' .. answersString .. '"], "rankedAnswers": ["' .. highestString .. '"], "playerInputs": ["' .. playersString .. '"]}'
        end`,
        keys,
        args
    );

    console.log("we here", advanceRound);

    const parsed = JSON.parse(JSON.stringify(advanceRound));

    const answers = parsed.answers;
    const rankedAnswers = parsed.rankedAnswers;
    const playerInputs = parsed.playerInputs;
    let answersArr = [];
    let playerInputsArr = [];
    let highestArr = [];
    let lowestArr = [];
    let top5Arr = [];
    let chosenArr = [];

    if(rankedAnswers != 'null'){
        for(let i = 0; i < rankedAnswers.length; i+=2){
            let obj = {inputId: rankedAnswers[i], input:answers[rankedAnswers[i]] , score: rankedAnswers[i + 1]}
            if(rankedAnswers[i+1] = rankedAnswers[1]) highestArr.push(obj);
            if(rankedAnswers[i+1] == 1) lowestArr.push(obj);
            answersArr.push(obj);
            playerInputsArr.push({playerId: playerInputs[i], inputId: playerInputs[i+1]})
        }

        if(round == '1'){
            const min = 0;
            const max = playerInputs.length/2 - 1;
            const randomInt1 = (Math.floor(Math.random() * (max - min + 1)) + min) * 2;
            let randomInt2 = (Math.floor(Math.random() * (max - min + 1)) + min) * 2;
            while(randomInt1 == randomInt2){
                randomInt2 = (Math.floor(Math.random() * (max - min + 1)) + min) * 2;
            } 
            
            chosenArr.push({playerId: playerInputs[randomInt1], input: answersArr[playerInputs[randomInt1+1]].input},
                            {playerId: playerInputs[randomInt2], input: answersArr[playerInputs[randomInt2+1]].input})
        }
        else{
            let highestString = ""
            let loneString = ''
    
            for(let i = 0; i < highestArr.length; i++){
                highestString+= `'${highestArr[i].inputId}'`
            }
    
            if(lowestArr.length > 2){
                const min = 0;
                const max = lowestArr.length;
                const randomInt1 = Math.floor(Math.random() * (max - min + 1)) + min;
                let randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
                while(randomInt1 == randomInt2) randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
                chosenArr.push(lowestArr[randomInt1], lowestArr[randomInt2])
            }
            else{
                chosenArr.push(answersArr[answersArr.length-1], answersArr[answersArr.length-2])
            }
    
            for(let i = 0; i < 5; i++){
                top5Arr.push(answersArr[i])
                if(i == answersArr.length - 1) break;
            }
        }
        

    }




    let JSONResponse = {round: parsed.cRound,
                        chosenAnswers: chosenArr,
                        highestAnswers: top5Arr}

    console.log(JSONResponse);
    
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
        body: JSON.stringify(JSONResponse)
      }

    return response
}