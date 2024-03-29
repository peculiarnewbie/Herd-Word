
import PlayerCheck from './PlayerCheck';
import './styles.css';

export default async function Page({ params }: { params: { room: string } }){

    const roomId = params.room;

    //@ts-ignore
    const JoinRoom = async (passedRoom, passedPlayer, fromCookie) => {
        'use server';
        
        console.log("at server", passedRoom, passedPlayer);
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        
        var raw = JSON.stringify({
          "roomId": `${passedRoom}`,
          "userId": `${passedPlayer}`,
          "fromCookie": `${fromCookie}`
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          next: { revalidate: 0 }
        };
        
        //@ts-ignore
        const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/joinroom", requestOptions)
          .then(response => response.text())

        console.log(result)
    
        return JSON.parse(result).body;
      }
    

    return(
        <div className="WebRoot">
            <PlayerCheck CallCreateRoom={JoinRoom} roomId = {roomId}></PlayerCheck>
        </div>
    )

    
}