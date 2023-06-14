import PlayerList from "./PlayerList";
import NameField from "@/components/NameField";
import * as Form from '@radix-ui/react-form';
import { useEffect } from "react";
import './styles.css'



export default function RoomLobby({loading, joined, message, players, roomId, setId, setLoading }: {loading:boolean, joined:boolean, message:string, players:string[], roomId:string, setId:any, setLoading:any}){

    //@ts-ignore
    const CallCreateRoom = async (event) => {
        event.preventDefault();
        const playerIdForm = event.target.name.value;

        console.log(roomId, playerIdForm)

        if(playerIdForm !== undefined){
            setId(playerIdForm)
            setLoading(true)
        }
    }

    if(loading){
        return(
            <p>loading...</p>
        )
    }

    if(joined){
        return(
            <>
                <p>{message}</p>
                <PlayerList players={players} roomId={roomId}></PlayerList>
            </>
        )
    }
    else{
        return(
            <>
                <p>{message}</p>
                <Form.Root className="FormRoot" onSubmit={CallCreateRoom}>
                    <NameField withButton={true} label="Name" message="Please enter your name"></NameField>
                </Form.Root>
            </>
        )
    }
}