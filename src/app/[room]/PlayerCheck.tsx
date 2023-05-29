'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

//@ts-ignore
export default async function PlayerCheck({CreateRoom, roomId}) {
    const playerId = useSearchParams()?.get('playerId')
    const [message, setMessage] = useState("")
    const [showInput, setShowInput] = useState(true)

    useEffect(() => {
        console.log(playerId, roomId);

        const  CheckPlayer = async () => {
            if(playerId){
                const result = await CreateRoom(roomId, playerId);
        
                console.log(result);
                
                if(result.code == 101 || result.code == 102){
                    document.cookie = `playerId=${playerId}`
                    setShowInput(false);
                    setMessage(`welcome, ${playerId}`)
                }
                else if(result.code == 103){
                    setMessage(`name exists in room`)
                }
                else{
                    setMessage(`sht broke`)
                }
                console.log(result)
                console.log(message);
            }
            else{
                setMessage(`input name`)
            }
        }

        //@ts-ignore
        CheckPlayer()

    }, [])
    return(
        <p>{message}</p>
    )
}