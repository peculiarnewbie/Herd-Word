import React, { useEffect, useState } from 'react';
import NameField from './NameField';
import './styles.css';

//@ts-ignore
export default function HomeNameField({playerId, setPlayerId}){
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
            <NameField withButton={false}></NameField>
        )
    }
}