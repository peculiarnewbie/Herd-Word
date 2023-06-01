

export default function PlayerScore({score, lone}: {score:number, lone:number}){
    return(
        <>
            <p>score: {score}</p>
            <p>lone: {lone}</p>
        </>
    )
}