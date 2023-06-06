'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import RoomLobby from "./RoomLobby"
import Ably from 'ably'
import { useCookies } from 'react-cookie';
import PlayerScore from "./PlayerScore";
import PlayArea from "./PlayArea"
import OptionalButton from "./OptionalButton"
import CreateRoom from "./CreateRoom"


let gameChannel:Ably.Types.RealtimeChannelPromise;
let ably:Ably.Types.RealtimePromise;

//@ts-ignore
export default function PlayerCheck({CallCreateRoom, roomId}) {
    const [playerIdFromQuery, setFromQuery] = useState(useSearchParams()?.get('playerId'))
    const [cookies, setCookie] = useCookies(['playerId', 'isMaster']);
    // const [playerId, setPlayerId] = useState("")
    const [message, setMessage] = useState("")
    const [joined, setJoined] = useState(false)
    const [loading, setLoading] = useState(true)
    const [players, setPlayers] = useState([''])
    const [chosenAnswers, setChosenAnswers] = useState([''])
    const [highestAnswers, setHighestAnswers] = useState([''])
    const [answers, setAnswers] = useState({chosen: [], highest: [], lone: []})
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    const [round, setRound] = useState(0);
    const [roomInfo, setRoomInfo] = useState({})
    const [playersWScores, setPlayersWScores] = useState({highest:[], lonest:[]})
    const [gameParams, setGameParams] = useState({})
    let fromCookie = false;
    const [playerId, setPlayerId] = useState('');
    let id = ''

    useEffect(() => {
        const DoShtForMaster = async () =>{

        }

        DoShtForMaster()
    }, [isMaster])

    useEffect(() => {
        const ConnectToAbly  = async () => {
            ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
            
            gameChannel = ably.channels.get(`[?rewind=1]herdword:${roomId}`);
        }

        ConnectToAbly()

        return () => {
            gameChannel.detach();
            ably.close()
        }
    }, [])

    useEffect(() => {
        

        const  CheckPlayer = async () => {
            if(isMaster){
                await SubToAblyActions()
                return;
            }
            // if(cookies.isMaster) setIsMaster(true);
            if(cookies.playerId){
                id = cookies.playerId
                setPlayerId(id)
                fromCookie = true;
            }
            else if(playerIdFromQuery){
                console.log('get in ere')
                id = playerIdFromQuery
                setPlayerId(id);
                fromCookie = false;
                history.replaceState({}, document.title, `/${roomId}`);
            }
            else{
                setMessage(`input name`)
                setJoined(false)
                setLoading(false);
                return;
            }
            console.log(id, roomId, fromCookie);

            if(id){
                const result = JSON.parse(await CallCreateRoom(roomId, id, fromCookie));

                console.log(result)

                if(result.code == 101){
                    // await SubToAblyActions()
                    // if(!fromCookie) document.cookie = `playerId=${id}`
                    // document.cookie = `isMaster=true`
                    setCreatingRoom(true);
                    // setIsMaster(true);
                    setMessage(`create a room`)
                    // setJoined(true)
                }
                else if(result.code == 102){
                    await SubToAblyActions()
                    if(!fromCookie) document.cookie = `playerId=${id}`
                    document.cookie = `isMaster=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
                    setIsMaster(false);
                    setMessage(`welcome, ${id}`)
                    setGameParams(result.roomInfo.params)
                    setJoined(true)
                }
                else if(result.code == 103){
                    await SubToAblyActions()
                    setMessage(`welcome back, ${id}`)
                    setRound(result.roomInfo.round)
                    console.log(result.roomInfo.roomMaster, id)
                    if(result.roomInfo.roomMaster == id) setIsMaster(true);
                    setGameParams(result.roomInfo.params)
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
                    setMessage(`what's this code then`)
                    console.log(result.code);
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

        const SubToAblyActions = async () => {
            await gameChannel.subscribe(':actions', (message) => {
                console.log('Received a greeting message in realtime: ' + message.data)
                const messageObj = JSON.parse(message.data);
                setRound(messageObj.round);
                setAnswers({chosen : messageObj.chosenAnswers,
                            highest: messageObj.highestAnswers,
                            lone: messageObj.loneAnswers});
                setPlayersWScores(messageObj.playerScores);

                console.log(round, answers);
                // ReceiveRoomAction(message.data)
            });
        }

        CheckPlayer()

        return () => {

        };

    }, [playerIdFromQuery, isMaster])

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
        delCommand += `herdword:${roomId} herdword:${roomId}:players herdword:${roomId}:lonest `
        for(let i = 1; i < round; i++){
            delCommand += `herdword:${roomId}:${i}:inputs herdword:${roomId}:${i}:playerinputs herdword:${roomId}:${i}:inputRank `
        }

        console.log(delCommand)
    }

    const ChangeName = (newId:string) => {
        
    }

    if(creatingRoom){
        return(
            <>
                <CreateRoom roomId={roomId} 
                            playerId={playerId}
                            loading={loading}
                            setLoading={setLoading} 
                            setJoined = {setJoined}
                            setCreatingRoom = {setCreatingRoom}
                            setIsMaster = {setIsMaster}
                            ></CreateRoom>
            </>
        )
    }

    if(round == 0){
        return(
            <>
                <RoomLobby
                joined={joined} 
                message={message} 
                players={players} 
                loading={loading}
                setLoading={setLoading} 
                roomId={roomId}
                setId={setFromQuery}></RoomLobby>
                <OptionalButton show={isMaster && !loading} text="Start Game" onClick={AdvanceRound}></OptionalButton>
            </>
        )
    }
    else{
        return(
            <>
                <PlayArea loading={loading} round={round} roomId={roomId} playerId={playerId} answers={answers} playersWScores={playersWScores} gameParams={gameParams}></PlayArea>
                <OptionalButton show={isMaster && !loading} text="NextRound" onClick={AdvanceRound}></OptionalButton>
                <OptionalButton show={isMaster && !loading} text="Del" onClick={DelCommand}></OptionalButton>
            </>
        )
    }
}
