
export default function RoundResults({round, answers, playersWScores}:{round:number, answers:any, playersWScores:any}){
    
    return(
        <>
            <p>highest:</p>
            {
                answers?.highest?.map((answer:any, index:number) => {
                    return(
                        <p>{index}. {answer.input} score: {answer.score}</p>
                    )
                })
            }
            <p>lone:</p>
            {
                answers?.lone?.map((answer:any, index:number) => {
                    return(
                        <p>{index}. {answer.input} score: {answer.score}</p>
                    )
                })
            }
            <p>leader:</p>
            {
                playersWScores?.highest?.map((player:any) => {
                    return(
                        <p>1. {player.playerId} score: {player.score}</p>
                    )
                })
            }
            <p>lonest:</p>
            {
                playersWScores?.lonest?.map((player:any) => {
                    return(
                        <p>1. {player.playerId} score: {player.score}</p>
                    )
                })
            }
        </>

    )
}