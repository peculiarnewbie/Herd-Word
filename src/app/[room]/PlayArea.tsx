import PlayerList from "./PlayerList";
import NameField from "@/components/NameField";
import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from "react";
import FormButton from "@/components/FormButton";
import PlayerScore from "./PlayerScore";
import RoundResults from "./RoundResults";




export default function PlayArea({loading, round, roomId, playerId, answers, playersWScores}: {loading:boolean, round:number, roomId:string, playerId:string, answers:any, playersWScores:any}){
    const [showInput, setShowInput] = useState(true);
    const [confirmedInput, setConfirmedInput] = useState('')
    const [inputId, setInputId] = useState('')

    const[score, setScore] = useState(0);
    const[loneScore, setLoneScore] = useState(0);

    useEffect(() => {
        console.log("id before score:", inputId);
        // for(let i = 0; i < answers.highest.length; i++)
        // {
        //     let obj = answers.highest[i]
        //     if(obj.highest){
        //         if(inputId == obj.inputId) setScore(score + 1)
        //     }
        //     else break;
        // }

        if(round > 1){
            for(let i = 0; i < answers?.highest?.length; i++){
                if(inputId == answers.highest[i].inputId) {
                    if(answers.highest[i].highest) setScore(score + 1)
                };
            }
    
            for(let i = 0; i < answers?.lone?.length; i++){
                if(inputId == answers.lone[i].inputId) setLoneScore(loneScore + 1);
            }
        }

        
        setShowInput(true);
    }, [round])

    //@ts-ignore
    const SendInput = async (event) =>{
        event.preventDefault();

        const input = event.target.answer.value

        setShowInput(false);
        console.log("sending input");
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        
        var raw = JSON.stringify({
            "roomId": `${roomId}`,
            "userId": `${playerId}`,
            "round": `${round}`,
            "input": `${input}`
          });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          next: { revalidate: 0 }
        };
        
        //@ts-ignore
        const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/roomactions/sendinput", requestOptions)
          .then(response => response.text())

        
        setConfirmedInput(input);

        console.log(JSON.parse(result).body)
    
        setInputId(JSON.parse(result).body.inputId);
    }

    if(loading){
        return(
            <p>loading...</p>
        )
    }

    if(showInput){
        return(
            <>
                <RoundResults round={round} answers={answers} playersWScores={playersWScores}></RoundResults>
                <Form.Root onSubmit={SendInput}>
                    <Form.Field className="FormField" name="answer">
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <Form.Label className="FormLabel">Answer</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Please enter your answer
                        </Form.Message>
                        </div>
                        <Form.Control asChild>
                        <input className="Input" required />
                        </Form.Control>
                        <FormButton withButton={true} label="Continue"></FormButton>
                    </Form.Field>
                </Form.Root>

                <p>round: {round}</p>

                <PlayerScore score={score} lone={loneScore}></PlayerScore>
            
            </>
        )
    }
    else{
        return(
            <>
                <p>You Answered {confirmedInput}</p>
            </>
        )
    }
}