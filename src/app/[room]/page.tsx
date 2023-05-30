
import { cookies } from 'next/headers';
import FormDemo from '@/components/Form';
import PlayerCheck from './PlayerCheck';

export default async function Page({ params }: { params: { room: string } }){
    const playerId = cookies().get("playerId")?.value;
    const roomId = params.room;

    //@ts-ignore
    const CreateRoom = async (passedRoom, passedPlayer) => {
        'use server';
        
        console.log("at server", passedRoom, passedPlayer);
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        const fromCookie = playerId? true : false
        
        var raw = JSON.stringify({
          "roomId": `${passedRoom}`,
          "userId": `${passedPlayer}`,
          "fromCookie": fromCookie
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          next: { revalidate: 0 }
        };
        
        //@ts-ignore
        const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/createroom", requestOptions)
          .then(response => response.text())
    
        console.log(result);
    
        return JSON.parse(result).body;
      }

    

    return(
        //@ts-ignore
        <PlayerCheck CreateRoom={CreateRoom} roomId = {roomId} playerIdCookie={playerId}></PlayerCheck>
    )

    
}