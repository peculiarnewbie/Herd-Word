
export default function RoundResults({round, answers, playersWScores}:{round:number, answers:any, playersWScores:any}){
    if(round == 1){
        return(
            <p>answer with any random word that comes to your mind</p>
        )
    }
    else if (round == 2){
        return(
            <>
                <p>chosen: </p>
                <p>1. {answers?.chosen[0]?.input} by {answers?.chosen[0]?.playerId}</p>
                <p>2. {answers?.chosen[1]?.input} by {answers?.chosen[1]?.playerId}</p>
            </>
        )
    }
    else{
        return(
            <>
                <p>chosen: </p>
                <p>1. {answers?.chosen[0]?.input} by {answers?.chosen[0]?.playerId}</p>
                <p>2. {answers?.chosen[1]?.input} by {answers?.chosen[1]?.playerId}</p>
                <p>highest: </p>
                <p>1. {answers?.highest[0]?.input} score: {answers?.highest[0]?.score}</p>
                <p>2. {answers?.highest[1]?.input} score: {answers?.highest[1]?.score}</p>
                <p>3. {answers?.highest[2]?.input} score: {answers?.highest[2]?.score}</p>
                <p>lone: {JSON.stringify(answers.lone)}</p>
                <p>leader: </p>
                <p>1. {playersWScores?.highest[0]?.playerId} score: {playersWScores?.highest[0]?.score}</p>
                <p>2. {playersWScores?.highest[1]?.playerId} score: {playersWScores?.highest[1]?.score}</p>
                <p>3. {playersWScores?.highest[2]?.playerId} score: {playersWScores?.highest[2]?.score}</p>
                <p>lonest: </p>
                <p>1. {playersWScores?.lonest[0]?.playerId} score: {playersWScores?.lonest[0]?.score}</p>
                <p>2. {playersWScores?.lonest[1]?.playerId} score: {playersWScores?.lonest[1]?.score}</p>
                <p>3. {playersWScores?.lonest[2]?.playerId} score: {playersWScores?.lonest[2]?.score}</p>
            </>

        )
    }
}