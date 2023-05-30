'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import RoomLobby from "./RoomLobby"

//@ts-ignore
export default async function PlayerCheck({CreateRoom, roomId, playerIdCookie}) {
    const playerIdFromQuery = useSearchParams()?.get('playerId')
    // const [playerId, setPlayerId] = useState("")
    const [message, setMessage] = useState("")
    const [joined, setJoined] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const [players, setPlayers] = useState([''])
    let fromCookie = false;
    let playerId = ""

    useEffect(() => {
        if(playerIdFromQuery){
            playerId = playerIdFromQuery;
            fromCookie = false;
        }
        else if(playerIdCookie){
            playerId = playerIdCookie
            fromCookie = true;
        }
        else{
            setMessage(`input name`)
            setJoined(false)
            return;
        }
        console.log(playerId, roomId, fromCookie);

        const  CheckPlayer = async () => {
            if(playerId){
                const result = await CreateRoom(roomId, playerId);
        
                console.log(result);
                
                if(result.code == 101){
                    if(!fromCookie) document.cookie = `playerId=${playerId}`
                    document.cookie = `isMaster=true`
                    setShowInput(false);
                    setMessage(`created room as ${playerId}`)
                    setJoined(true)
                }
                else if(result.code == 102){
                    if(!fromCookie) document.cookie = `playerId=${playerId}`
                    setShowInput(false);
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
                    return;
                }
                else{
                    setMessage(`sht broke`)
                    setJoined(false)
                    return;
                }
                setPlayers(result.players)
                console.log(result)
                console.log(message);
            }
        }

        //@ts-ignore
        CheckPlayer()

    }, [])
    return(
        <RoomLobby joined={joined} message={message} players={players}></RoomLobby>
    )
}