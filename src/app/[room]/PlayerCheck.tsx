'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import RoomLobby from "./RoomLobby"
import Ably from 'ably'
import { useCookies } from 'react-cookie';

let gameChannel:Ably.Types.RealtimeChannelPromise;

//@ts-ignore
export default function PlayerCheck({CreateRoom, roomId}) {
    const playerIdFromQuery = useSearchParams()?.get('playerId')
    const [cookies, setCookie] = useCookies(['playerId']);
    // const [playerId, setPlayerId] = useState("")
    const [message, setMessage] = useState("")
    const [joined, setJoined] = useState(true)
    const [loading, setLoading] = useState(true)
    const [players, setPlayers] = useState([''])
    const [round, setRound] = useState(0);
    let fromCookie = false;
    let playerId = ""

    useEffect(() => {
        if(playerIdFromQuery){
            console.log('get in ere')
            playerId = playerIdFromQuery? playerIdFromQuery : "null";
            fromCookie = false;
            history.replaceState({}, document.title, `/${roomId}`);
        }
        else if(cookies.playerId){
            playerId = cookies.playerId
            fromCookie = true;
        }
        else{
            setMessage(`input name`)
            setJoined(false)
            setLoading(false);
            return;
        }
        console.log(playerId, roomId, fromCookie);

        const  CheckPlayer = async () => {
            if(playerId){
                const result = await CreateRoom(roomId, playerId, fromCookie);
                console.log(result)

                if(result.code == 101){
                    if(!fromCookie) document.cookie = `playerId=${playerId}`
                    document.cookie = `isMaster=true`
                    setMessage(`created room as ${playerId}`)
                    setJoined(true)
                }
                else if(result.code == 102){
                    if(!fromCookie) document.cookie = `playerId=${playerId}`
                    setMessage(`welcome, ${playerId}`)
                    setJoined(true)
                }
                else if(result.code == 103){
                    setMessage(`welcome back, ${playerId}`)
                    setJoined(true)
                }
                else if(result.code == 104){
                    setMessage(`name exists in room`)
                    setJoined(false)
                    setLoading(false)
                    return;
                }
                else if(result.code == 105){
                    setMessage(`Room is playing`)
                    setLoading(false)
                    return;
                }
                else{
                    setMessage(`sht broke`)
                    setJoined(false)
                    setLoading(false)
                    return;
                }
                setPlayers(result.players)
                console.log(message);
            }
            setLoading(false)
        }

        const  ConnectToAbly = async () => {
            const ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
            
            gameChannel = ably.channels.get(`herdword:${roomId}`);
            await gameChannel.subscribe(':actions', (message) => {
                console.log('Received a greeting message in realtime: ' + message.data)
            });
        }
          
        ConnectToAbly()
        CheckPlayer()

        return () => {
            gameChannel.detach();
        };

    }, [])
    return(
        <RoomLobby
        joined={joined} 
        message={message} 
        players={players} 
        loading={loading} 
        roomId={roomId}></RoomLobby>
    )
}