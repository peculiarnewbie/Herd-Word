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
    const [answers, setAnswers] = useState({})
    const [isMaster, setIsMaster] = useState(false);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lone, setLone] = useState(0);
    const [playersWScores, setPlayersWScores] = useState({})
    let fromCookie = false;
    const [playerId, setPlayerId] = useState('');
    let id = ''

    useEffect(() => {
        

        const  CheckPlayer = async () => {
            if(cookies.isMaster) setIsMaster(true);
            if(playerIdFromQuery){
                console.log('get in ere')
                id = playerIdFromQuery
                setPlayerId(id);
                fromCookie = false;
                history.replaceState({}, document.title, `/${roomId}`);
            }
            else if(cookies.playerId){
                id = cookies.playerId
                setPlayerId(id)
                fromCookie = true;
            }
            else{
                setMessage(`input name`)
                setJoined(false)
                setLoading(false);
                return;
            }
            console.log(id, roomId, fromCookie);

            if(id){
                const result = await CreateRoom(roomId, id, fromCookie);
                console.log(result)

                if(result.code == 101){
                    if(!fromCookie) document.cookie = `playerId=${id}`
                    document.cookie = `isMaster=true`
                    setMessage(`created room as ${id}`)
                    setJoined(true)
                }
                else if(result.code == 102){
                    if(!fromCookie) document.cookie = `playerId=${id}`
                    setMessage(`welcome, ${id}`)
                    setJoined(true)
                }
                else if(result.code == 103){
                    setMessage(`welcome back, ${id}`)
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
            else{
                setMessage(`sht broke`)
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
                setAnswers({chosen : messageObj.chosenAnswers,
                            highest: messageObj.highestAnswers})

                console.log(round, answers);
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

    const DelCommand = () => {
        let delCommand = "DEL "
        for(let i = 1; i < round; i++){
            delCommand += `herdword:${roomId}:${i}:inputs herdword:${roomId}:${i}:playerinputs herdword:${roomId}:${i}:inputRank `
        }

        console.log(delCommand)
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
                <PlayArea loading={loading} round={round} roomId={roomId} playerId={playerId} answers={answers}></PlayArea>
                <p>round: {round}</p>
                <PlayerScore score={score} lone={lone}></PlayerScore>
                <OptionalButton show={isMaster && !loading} text="NextRound" onClick={AdvanceRound}></OptionalButton>
                <OptionalButton show={isMaster && !loading} text="Del" onClick={DelCommand}></OptionalButton>
            </>
        )
    }
}
