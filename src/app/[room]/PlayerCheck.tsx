'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import RoomLobby from "./RoomLobby"
import Ably from 'ably'
import PlayerScore from "./PlayerScore";
import PlayArea from "./PlayArea"
import OptionalButton from "./OptionalButton"
import CreateRoom from "./CreateRoom"


let gameChannel:Ably.Types.RealtimeChannelPromise;
let answerChannel:Ably.Types.RealtimeChannelPromise;
let ably:Ably.Types.RealtimePromise;
let connectedToAbly = {value: true};

//@ts-ignore
export default function PlayerCheck({CallCreateRoom, roomId}) {
    const [playerIdFromQuery, setFromQuery] = useState(useSearchParams()?.get('playerId'))
    // const [playerId, setPlayerId] = useState("")
    const [message, setMessage] = useState("")
    const [joined, setJoined] = useState(false)
    const [loading, setLoading] = useState(true)
    const [players, setPlayers] = useState([''])
    const [answers, setAnswers] = useState({prompt: '', chosen: [], highest: [], lone: []})
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    const [round, setRound] = useState(0);
    const [combinedIds, setCombinedIds] = useState<any>([])
    const [playersWScores, setPlayersWScores] = useState({highest:[], lonest:[]})
    const [gameParams, setGameParams] = useState({})
    let fromCookie = false;
    const [playerId, setPlayerId] = useState<string|null>('');
    let id: string | null = ''

    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        if(isTesting){
            setLoading(!isTesting)
            setRound(2)
            setIsMaster(true)

        }
    }, [isTesting])

    useEffect(() => {
        const DoShtForMaster = async () =>{

        }

        DoShtForMaster()
    }, [isMaster])

    useEffect(() => {
        if(isTesting) return;

        connectedToAbly.value = false
        const ConnectToAbly  = async () => {
            ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
            connectedToAbly.value = true
            gameChannel = ably.channels.get(`[?rewind=1]herdword:${roomId}`);
            answerChannel = ably.channels.get(`herdword:${roomId}`)
        }

        ConnectToAbly()

        return () => {
            gameChannel.detach();
            answerChannel.detach();
            ably.close()
        }
    }, [])

    useEffect(() => {
        if(isTesting) return;

        const  CheckPlayer = async () => {
            if(isMaster){
                await SubToAblyActions()
                return;
            }
            // if(cookies.isMaster) setIsMaster(true);
            if(localStorage.getItem('playerId')){
                id = localStorage.getItem('playerId')
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
            // console.log(id, roomId, fromCookie);

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
                    localStorage.setItem('round', '0')
                    // setJoined(true)
                }
                else if(result.code == 102){
                    await SubToAblyActions()
                    if(!fromCookie) localStorage.setItem('playerId', id)
                    localStorage.removeItem('isMaster')
                    setIsMaster(false);
                    setMessage(`welcome, ${id}`)
                    setGameParams(result.roomInfo.params)
                    setJoined(true)
                    localStorage.setItem('round', '0')
                }
                else if(result.code == 103){
                    await SubToAblyActions()
                    setMessage(`welcome back, ${id}`)
                    setRound(result.roomInfo.round)
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
            await waitFor(connectedToAbly)
            await gameChannel.subscribe(':actions', (message) => {
                console.log('Received a greeting message in realtime: ' + message.data)
                const messageObj = JSON.parse(message.data);
                setRound(messageObj.round);
                setAnswers({prompt: messageObj.prompt,
                            chosen : messageObj.chosenAnswers,
                            highest: messageObj.highestAnswers,
                            lone: messageObj.loneAnswers});
                setPlayersWScores(messageObj.playerScores);

                console.log(round, answers);
                // ReceiveRoomAction(message.data)
            });

            console.log('subbed to actions')
        }

        CheckPlayer()

        return () => {

        };

    }, [playerIdFromQuery, isMaster])

    const waitFor = async (condition:any) => {
        const checkAgain = async () =>{
            if(condition.value){
                return;
            } 
            else{
                await new Promise(resolve => setTimeout(resolve, 100))
                await checkAgain()
            }
        }
        await checkAgain()
    }

    const AdvanceRound = async () =>{
        setLoading(true);
        console.log("advancing round, combined:", combinedIds);
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        
        var raw = JSON.stringify({
          "roomId": `${roomId}`,
          "round": `${round}`,
          "combined": JSON.stringify(combinedIds)
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

        const parsed = JSON.parse(result)

        console.log(parsed);
    
        return parsed.body;
    }

    const DelCommand = () => {
        let delCommand = "DEL "
        delCommand += `herdword:${roomId} herdword:${roomId}:players herdword:${roomId}:lonest herdword:${roomId}:questions herdword:${roomId}:questionsunion `
        for(let i = 1; i <= round; i++){
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
                            setMessage={setMessage}
                            ></CreateRoom>
            </>
        )
    }

    if(round == 0){
        return(
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center'}}>
                <RoomLobby
                joined={joined} 
                message={message} 
                players={players} 
                loading={loading}
                setLoading={setLoading} 
                roomId={roomId}
                setId={setFromQuery}></RoomLobby>
                {isMaster? (
                    <OptionalButton show={isMaster && !loading} text="Start Game" onClick={AdvanceRound}></OptionalButton>

                ) : loading ? (<></>
                ) : joined ? (
                    <p>wait for the room master to start the game</p>
                ) : (<></>)}
            </div>
        )
    }
    else{
        return(
            <>
                <PlayArea loading={loading} 
                        round={round} 
                        roomId={roomId} 
                        playerId={playerId} 
                        answers={answers} 
                        playersWScores={playersWScores} 
                        gameParams={gameParams} 
                        isMaster={isMaster}
                        setCombinedIds={setCombinedIds}
                        isTesting={isTesting}></PlayArea>
                <OptionalButton show={isMaster && !loading} text="NextRound" onClick={AdvanceRound}></OptionalButton>
                <OptionalButton show={isMaster && !loading} text="Del" onClick={DelCommand}></OptionalButton>
            </>
        )
    }
}
