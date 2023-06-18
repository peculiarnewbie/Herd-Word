

export default function PlayerScore({score, lone}: {score:number, lone:number}){
    return(
        <>
            <p>your score</p>
            <p>score: {score}</p>
            <p>lone: {lone}</p>
        </>
    )
}