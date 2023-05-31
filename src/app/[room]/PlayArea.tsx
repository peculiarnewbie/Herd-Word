import PlayerList from "./PlayerList";
import NameField from "@/components/NameField";
import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from "react";
import FormButton from "@/components/FormButton";




export default function PlayArea({loading}: {loading:boolean}){
    const [showInput, setShowInput] = useState(true);

    if(loading){
        return(
            <p>loading...</p>
        )
    }

    if(showInput){
        return(
            <>
                <Form.Root>
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
                <p>results</p>
            </>
        )
    }
}