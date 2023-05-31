'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import RoomLobby from "./RoomLobby"
import Ably from 'ably'
import { useCookies } from 'react-cookie';
import PlayerScore from "./PlayerScore";
import PlayArea from "./PlayArea"
import OptionalButton from "./OptionalButton"

let gameChannel:Ably.Types.RealtimeChannelPromise;
let ably:Ably.Types.RealtimePromise;

//@ts-ignore
export default function PlayerCheck({CreateRoom, roomId}) {
    const playerIdFromQuery = useSearchParams()?.get('playerId')
    const [cookies, setCookie] = useCookies(['playerId', 'isMaster']);
    // const [playerId, setPlayerId] = useState("")
    const [message, setMessage] = useState("")
    const [joined, setJoined] = useState(true)
    const [loading, setLoading] = useState(true)
    const [players, setPlayers] = useState([''])
    const [chosenAnswers, setChosenAnswers] = useState([''])
    const [highestAnswers, setHighestAnswers] = useState([''])
    const [isMaster, setIsMaster] = useState(false);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lone, setLone] = useState(0);
    const [playersWScores, setPlayersWScores] = useState({})
    let fromCookie = false;
    let playerId = ""

    useEffect(() => {
        if(cookies.isMaster) setIsMaster(true);
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
                    setRound(result.round)
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
            ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
            
            gameChannel = ably.channels.get(`herdword:${roomId}`);
            await gameChannel.subscribe(':actions', (message) => {
                console.log('Received a greeting message in realtime: ' + message.data)
                const messageObj = JSON.parse(message.data);
                setRound(messageObj.round)
                setChosenAnswers(messageObj.chosenAnswers);
                setHighestAnswers(messageObj.highestAnswers)

                console.log(messageObj, messageObj.round, messageObj.chosenAnswers);
                console.log(round, chosenAnswers, highestAnswers);
                // ReceiveRoomAction(message.data)
            });
        }
          
        ConnectToAbly()
        CheckPlayer()

        return () => {
            gameChannel.detach();
            ably.close()
        };

    }, [])

    const AdvanceRound = async () =>{
        setLoading(true);
        console.log("advancing round");
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        
        var raw = JSON.stringify({
          "roomId": `${roomId}`,
          "round": `${round}`
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          next: { revalidate: 0 }
        };
        
        //@ts-ignore
        const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/roomactions/advanceround", requestOptions)
          .then(response => response.text())

        setLoading(false);
    
        return JSON.parse(result).body;
    }

    if(round == 0){
        return(
            <>
                <RoomLobby
                joined={joined} 
                message={message} 
                players={players} 
                loading={loading} 
                roomId={roomId}></RoomLobby>
                <OptionalButton show={isMaster && !loading} text="Start Game" onClick={AdvanceRound}></OptionalButton>
            </>
        )
    }
    else{
        return(
            <>
                <PlayArea loading={loading} ></PlayArea>
                <p>round: {round}</p>
                <PlayerScore score={score} lone={lone}></PlayerScore>
            </>
        )
    }

    function ReceiveRoomAction({message}: {message:string}){
        
    }
}
