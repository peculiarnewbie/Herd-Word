
import { cookies } from 'next/headers';
import FormDemo from '@/components/Form';
import PlayerCheck from './PlayerCheck';

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

      // const SubToRedisAnswers = async ({roomId} : {roomId:string}) => {
      //   'use server';

      //   const redis = createClient({
      //       url: process.env.REDIS_URL
      //     });

      //   await redis.connect()

      //   console.log(`connected to redis`);

      //   redis.unsubscribe()

      //   redis.subscribe('channel', (err, count) => {
      //     if (err) {
      //       //@ts-ignore
      //       console.error(err.message);
      //       return;
      //     }
      //     console.log(`Subscribed to ${count} channels.`);
      //   })

      //   redis.on('message', (channel, message) => {
      //     console.log(`Received message from ${channel} channel.`);
      //     console.log(JSON.parse(message));
      //   });
    // }

    

    return(
        <>
            <PlayerCheck CallCreateRoom={JoinRoom} roomId = {roomId}></PlayerCheck>
        </>
    )

    
}