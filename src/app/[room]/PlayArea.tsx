import PlayerList from "./PlayerList";
import NameField from "@/components/NameField";
import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from "react";
import FormButton from "@/components/FormButton";




export default function PlayArea({loading, round, roomId, playerId}: {loading:boolean, round:number, roomId:string, playerId:string}){
    const [showInput, setShowInput] = useState(true);
    const [confirmedInput, setConfirmedInput] = useState('')

    useEffect(() => {
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
    
        return JSON.parse(result).body;
    }

    if(loading){
        return(
            <p>loading...</p>
        )
    }

    if(showInput){
        return(
            <>
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
                        <FormButton withButton={true}></FormButton>
                    </Form.Field>
                </Form.Root>
            
            </>
        )
    }
    else{
        return(
            <>
                <p>{confirmedInput}</p>
            </>
        )
    }
}