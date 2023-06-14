import PlayerList from "./PlayerList";
import NameField from "@/components/NameField";
import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from "react";
import FormButton from "@/components/FormButton";
import PlayerScore from "./PlayerScore";
import RoundResults from "./RoundResults";
import { GameParams } from "./CreateRoom";
import PromptArea from "./PromptArea";
import './playArea.css'




export default function PlayArea({loading, round, roomId, playerId, answers, playersWScores, gameParams}: {loading:boolean, round:number, roomId:string, playerId:string, answers:any, playersWScores:any, gameParams:any}){
    const [showInput, setShowInput] = useState(true);
    const [confirmedInput, setConfirmedInput] = useState<string | null>('')
    const [inputId, setInputId] = useState('')

    const[score, setScore] = useState(0);
    const[loneScore, setLoneScore] = useState(0);

    const [sendingAnswer, setSendingAnswer] = useState(false);

    function HandleInputStates(sending?:boolean, input?:string, inputId?:number, reset?:boolean){
        if(reset){
            const previousRound = localStorage.getItem('round')
            console.log('is reset')
            if(previousRound){
                if(round == parseInt(previousRound)){
                    console.log('is resetting')
                    setConfirmedInput(localStorage.getItem('savedInput'))
                    setShowInput(false)
                    
                }
                return ;

            }
            setShowInput(true)
        }
        else if(input && inputId){
            setSendingAnswer(false);
            setShowInput(false);
            setConfirmedInput(input);
            setInputId(inputId.toString());
            localStorage.setItem('savedInput', input)
            localStorage.setItem('round', round.toString())
        }
        else if(sending){
            setSendingAnswer(true);
            setShowInput(false);
        }
        else{
            setSendingAnswer(false);
            setShowInput(true);
        }
    }

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

        
        HandleInputStates(true, '', 0, true)
    }, [round])

    //@ts-ignore
    const SendInput = async (event) =>{
        event.preventDefault();

        const input = event.target.answer.value

        HandleInputStates(true)
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
          
        const parsed = JSON.parse(result);
        
        if(parsed.statusCode == 200){
            HandleInputStates(true, input, parsed.body.inputId)
        }
        else{
            HandleInputStates(false)
        }
          
        console.log(parsed.statusCode)
    
    }

    if(loading){
        return(
            <p>loading...</p>
        )
    }

    else{
        return(
            <>
                {/* <RoundResults round={round} answers={answers} playersWScores={playersWScores}></RoundResults> */}
                <PromptArea prompt={answers.prompt}></PromptArea>

                {
                    showInput ? (
                        <PlayInput></PlayInput>
                    ) : (
                        <SendAnswerLoader></SendAnswerLoader>
                    )
                }
                

                <p>round: {round}</p>

                <PlayerScore score={score} lone={loneScore}></PlayerScore>
            
            </>
        )
    }

    function PlayInput(){
        return(
            <Form.Root onSubmit={SendInput}>
                <Form.Field className="FormField" name="answer">
                    <div style={{textAlign : 'center', margin: '1rem'}}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom : '6px' }}>
                        {/* <Form.Label className="FormLabel">Answer</Form.Label> */}
                        <Form.Message className="FormMessage" match="valueMissing">
                            Please enter your answer
                        </Form.Message>
                        </div>
                        <Form.Control asChild >

                            <input className="Input" required placeholder="What would the most common answer be?"  />
                        </Form.Control>
                        <FormButton withButton={true} label="Answer"></FormButton>
                    </div>
                </Form.Field>
            </Form.Root>
        )
    }

    function SendAnswerLoader(){
        return (
            <div style={{alignItems: 'center', textAlign: 'center', width: '100%', margin: '1rem'}}>

                {sendingAnswer ? (
                    <p>loading...</p>
                    ) : (
                        <p>You answered: {confirmedInput}</p>
                        )}
            </div>
        )
    }
}
