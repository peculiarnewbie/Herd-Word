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
        localStorage.removeItem('playerId')
        localStorage.removeItem('isMaster')
        console.log("deleted cookie")
        setPlayerId("null");
    }

    if(playerId != "null"){
        return(
            <div style={{display: 'flex', gap: '1rem', paddingTop: '1rem', alignItems: 'center'}}>
                <p>welcome, {playerId}</p>
                <button type="button" className="Button" onClick={DeleteIdCookie}>change name</button>
            </div>
        )
    }
    else {
        return(
            <NameField withButton={false} label='Name' message='Please enter your name'></NameField>
        )
    }
}