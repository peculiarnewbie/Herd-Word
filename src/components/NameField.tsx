import React, { useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import './styles.css';

//@ts-ignore
export default function NameField({playerId, setPlayerId}){
    const [forReRender, setForReRender] = useState(true);

    useEffect(() => {
        setForReRender(false);
      }, [forReRender])

    const DeleteIdCookie = () => {
        document.cookie = "playerId=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        console.log("deleted cookie")
        setPlayerId("null");
    }

    if(playerId != "null"){
        return(
            <div>
                <p>welcome, {playerId}</p>
                <button type="button" className="Button" onClick={DeleteIdCookie}>change name</button>
            </div>
        )
    }
    else {
        return(
            <Form.Field className="FormField" name="name">
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Form.Label className="FormLabel">Name</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                    Please enter your name
                </Form.Message>
                </div>
                <Form.Control asChild>
                <input className="Input" required />
                </Form.Control>
            </Form.Field>
        )
    }
}