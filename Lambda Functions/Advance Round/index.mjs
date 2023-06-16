import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})

const PublishAction = async (action, roomId) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${process.env.HERD_ABLY_API_KEY}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "name": ":actions",
      "data": JSON.stringify(action)
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    //@ts-ignore
    const result = await fetch(`https://rest.ably.io/channels/herdword:${roomId}/messages`, requestOptions)
      .then(response => response.text())

    console.log(result)

    return JSON.parse(result)
}


export const handler = async (event, context) => {
    const roomId = event.roomId;
    const round = event.round;
    const combined = event.combined;

    const chosenAnswerCount = 2;
    
    console.log({roomId, round, combined})

    const keys = [`herdword:${roomId}`, 
    `herdword:${roomId}:${round}:inputs`,
    `herdword:${roomId}:${round}:playerinputs`,
    `herdword:${roomId}:${round}:inputRank`,
    `herdword:${roomId}:questions`];
	const args = [round, chosenAnswerCount]

    const advanceRound = await redis.eval(
        `
        local currentRound = redis.call('HINCRBY', KEYS[1], 'round', 1)
        
        local answers = redis.call('HGETALL', KEYS[2])
        local answersString = table.concat(answers, '", "')

        local playerInputs = redis.call('ZRANGE', KEYS[3], '0', '-1', 'WITHSCORES')
        local playersString = table.concat(playerInputs, '", "')

        local prompt = cjson.encode(redis.call('HGET', KEYS[5], currentRound))

        if ARGV[1] == '0' then
            return '{"round": ' .. currentRound .. ', "answers": "null", "rankedAnswers": "null", "prompt": ' .. prompt .. '}'
        else
            local highestAnswers = redis.call('ZREVRANGE', KEYS[4], '0', '-1', 'WITHSCORES')
            local highestString = table.concat(highestAnswers, '", "')
            
            return '{"round": ' .. currentRound .. ', "answers": ["' .. answersString .. '"], "rankedAnswers": ["' .. highestString .. '"], "playerInputs": ["' .. playersString .. '"], "prompt": ' .. prompt .. '}'
        end`,
        keys,
        args
    );

    console.log("we here", advanceRound);

    const parsed = JSON.parse(JSON.stringify(advanceRound));

    const answers = parsed.answers;
    const rankedAnswers = parsed.rankedAnswers;
    const playerInputs = parsed.playerInputs;
    const prompt = parsed.prompt;
    let answersFlat = [];
    let answersArr = [];
    let playerInputsArr = [];
    let lowestArr = [];
    let top5Arr = [];
    let chosenArr = [];
    let playerScoresArr = {};
    
    if(rankedAnswers != 'null'){
        for(let i = 0; i < answers.length; i+=2){
            answersFlat.push({input: answers[i], inputId: answers[i+1]});
        }
        for(let i = 0; i < playerInputs.length; i+=2){
            playerInputsArr.push({playerId: playerInputs[i], inputId: playerInputs[i+1]})
        }
        for(let i = 0; i < rankedAnswers.length; i+=2){
            let obj = {inputId: rankedAnswers[i], input: answersFlat.find(s => s.inputId === rankedAnswers[i]).input , score: rankedAnswers[i + 1], highest: false}
            // if(rankedAnswers[i+1] == rankedAnswers[1] && rankedAnswers[1] > 1) obj.highest = true;
            // if(rankedAnswers[i+1] == 1) lowestArr.push(obj);
            answersArr.push(obj);
        }

        let highestScore = answersArr[0].score;

        const combinedIds = JSON.parse(combined);

        combinedIds.forEach((combined) => {
            let totalScore = 0;
            combined.forEach((id) => {
                totalScore += parseInt(answersArr.find(s => s.inputId == id).score);
            })
            if(highestScore < totalScore) highestScore = totalScore;
            combined.forEach((id) => {
                answersArr.find(s => s.inputId == id).score = totalScore;
            })
        })

        answersArr.forEach((answer) => {
            if(answer.score == highestScore) answer.highest = true;
        })

        console.log(answersArr, playerInputsArr);

        if(round == '1'){
            lowestArr = [];

            // const min = 0;
            // const max = playerInputsArr.length - 1;
            // const randomInt1 = Math.floor(Math.random() * (max - min + 1)) + min;
            // let randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
            // while(randomInt1 == randomInt2){
            //     if(max == 1) break;
            //     randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
            // } 

            // let chosen1 = playerInputsArr[randomInt1]
            // let chosen2 = playerInputsArr[randomInt2]
            
            // chosenArr.push({playerId: chosen1.playerId, input: answersArr.find(s => s.inputId == chosen1.inputId).input},
            //                 {playerId: chosen2.playerId, input: answersArr.find(s => s.inputId == chosen2.inputId).input})
        }
        else{

            //update score in redis
            let pointWinner = []
            let pipe = redis.pipeline()
    
            for(let i = 0; i < answersArr.length; i++){
                if(answersArr[i]?.highest){
                    const winners = await redis.zrange(keys[2], answersArr[i].inputId, answersArr[i].inputId, {byScore: true})
                    pointWinner = [...pointWinner, ...winners]
                }
            }

            if(pointWinner){
                for(let i = 0; i < pointWinner.length; i++){
                    pipe.zincrby(`herdword:${roomId}:players`, 1, `${pointWinner[i]}`)
                }
            }
            
            if(lowestArr){
                for(let i = 0; i < lowestArr.length; i++){
                    const playerInput = playerInputsArr.find(s => s.inputId === lowestArr[i].inputId)
                    let playerId = ''
                    if(playerInput) playerId = playerInput.playerId
                    pipe.zincrby(`herdword:${roomId}:lonest`, 1, `${playerId}`)
                }
            }
            
            await pipe.exec();

            const keys2 = [`herdword:${roomId}:players`, `herdword:${roomId}:lonest`]
            const args2 = ['2']

            //create player scores array to send to players
            const playerScores = await redis.eval(
                `
                local highestPlayers = redis.call('ZREVRANGE', KEYS[1], '0', ARGV[1], 'WITHSCORES')
                local highestString =  table.concat(highestPlayers, '", "')
                local lonestPlayers = redis.call('ZREVRANGE', KEYS[2], '0', ARGV[1], 'WITHSCORES')
                local lonestString =  table.concat(lonestPlayers, '", "')

                return '{"highest": ["' .. highestString .. '"], "lonest": ["' .. lonestString .. '"]}'
                `,
                keys2,
                args2
            );

            console.log("and there", pointWinner, lowestArr, playerScores);

            const scoreParsed = JSON.parse(JSON.stringify(playerScores));

            let highestPlayerArr = []
            let lonestPlayerArr = []

            for(let i = 0; i < 6; i+=2){
                highestPlayerArr.push({playerId: scoreParsed.highest[i], score: scoreParsed.highest[i+1]})
                lonestPlayerArr.push({playerId: scoreParsed.lonest[i], score: scoreParsed.lonest[i+1]})
            }

            playerScoresArr = {highest: highestPlayerArr, lonest: lonestPlayerArr}


            //choose next promt
            if(lowestArr.length > 2){
                const min = 0;
                const max = lowestArr.length - 1;
                const randomInt1 = Math.floor(Math.random() * (max - min + 1)) + min;
                let randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
                while(randomInt1 == randomInt2) randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
                chosenArr.push(lowestArr[randomInt1], lowestArr[randomInt2])
            }
            else{
                chosenArr.push(answersArr[answersArr.length-1], answersArr[answersArr.length-2])
            }

            //create top 5 answers
            for(let i = 0; i < 5; i++){
                top5Arr.push(answersArr[i])
                if(i == answersArr.length - 1) break;
            }
        }
        

    }




    // let JSONResponse = {round: parsed.round,
    //                     chosenAnswers: chosenArr,
    //                     highestAnswers: top5Arr,
    //                     loneAnswers: lowestArr,
    //                     playerScores: playerScoresArr}

    let JSONResponse = {round: parsed.round,
                        prompt: prompt,
                        highestAnswers: top5Arr,
                        loneAnswers: lowestArr,
                        playerScores: playerScoresArr}

    console.log(JSONResponse);
    
    await PublishAction(JSONResponse, roomId)

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