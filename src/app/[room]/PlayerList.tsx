import React, { useEffect, useState } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import './styles.css';
import Ably from 'ably'

let globalChannel:Ably.Types.RealtimeChannelPromise;

export default function PlayerList({players, roomId}: {players:string[], roomId:string}){
    const [playersArr, setPlayersArr] = useState(['']);

    useEffect(() => {
        setPlayersArr(players);
        const  ConnectToAbly = async () => {
            const ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
          
            globalChannel = ably.channels.get('herdword');
            await globalChannel.subscribe(roomId, (message) => {
              console.log('Received a greeting message in realtime: ' + message.data)
              setPlayersArr(playersArr => [...playersArr, message.data])
            });
          }
          
          ConnectToAbly()
      
          return () => {
            globalChannel.detach();
            };
            
    }, [])

    useEffect(() => {
        const  ConnectToAbly = async () => {
            const ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
          
            globalChannel = ably.channels.get('herdword');
            await globalChannel.subscribe(roomId, (message) => {
              console.log('Received a greeting message in realtime: ' + message.data)
            });
          }
      
          ConnectToAbly()
      
          return () => {
            globalChannel.detach();
            };

    }, []);

    return(
        <>
            <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                <div style={{ padding: '15px 20px' }}>
                    <div className="Text">Players</div>
                    {playersArr.map((tag) => (
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
            <p>there's {playersArr.length} players</p>
        </>
    )
}