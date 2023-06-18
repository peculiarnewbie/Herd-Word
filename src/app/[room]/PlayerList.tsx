import React, { useEffect, useState } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import './styles.css';
import Ably from 'ably'

let globalChannel:Ably.Types.RealtimeChannelPromise;
let ably:Ably.Types.RealtimePromise;

export default function PlayerList({players, roomId}: {players:string[], roomId:string}){
    const [playersArr, setPlayersArr] = useState(['']);

    useEffect(() => {
        setPlayersArr(players);
        const  ConnectToAbly = async () => {
            ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
          
            globalChannel = ably.channels.get(`herdword:${roomId}`);
            await globalChannel.subscribe(':players', (message) => {
              console.log('somebody joined: ' + message.data)
              setPlayersArr(playersArr => [...playersArr, message.data])
            });
          }
          
          ConnectToAbly()
      
        return () => {
            globalChannel.detach();
            ably.close()
        };  
            
    }, [])

    return(
        <>
            <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                <div style={{ padding: '15px 20px' }}>
                    <div className="Text">Players</div>
                    {playersArr.map((tag, index) => (
                    <div className="Tag" key={tag}>
                        {tag}
                    </div>
                    ))}
                </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="ScrollAreaCorner" />
            </ScrollArea.Root>
            <p>theres {playersArr.length} players</p>
        </>
    )
}