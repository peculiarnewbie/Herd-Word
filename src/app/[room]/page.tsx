
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
        
        var raw = JSON.stringify({
          "roomId": `${passedRoom}`,
          "userId": `${passedPlayer}`
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

    

    if(!playerId){
        return(
            //@ts-ignore
            <PlayerCheck CreateRoom={CreateRoom} roomId = {roomId}></PlayerCheck>
        )
        // const result = await CreateRoom()
        // const parsed = await JSON.parse(result).body;

        // if(parsed.code == 103){
        //     return <p>name exists in room</p>
        // }
        // else{
        //     return(
        //         <div>
        //             <p>welcome to {params.room}, {playerId}</p>
        //             <p>players: {parsed.players}</p>
        //         </div>
        //     )
        // }
    }

    else{
        const result = await CreateRoom(roomId, playerId)
        if(result.code == 102){
            return(
                <p>joined as {playerId}</p>
            )
        }
        else if (result.code == 103){
            return(
                <p>welcome back, {playerId}</p>
            )
        }
    }

    
}