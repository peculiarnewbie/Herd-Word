import PlayerList from "./PlayerList";
import NameField from "@/components/NameField";
import * as Form from '@radix-ui/react-form';


export default function RoomLobby({loading, joined, message, players }: {loading:boolean, joined:boolean, message:string, players:string[]}){
    
    if(loading){
        return(
            <p>loading...</p>
        )
    }

    if(joined){
        return(
            <>
                <p>{message}</p>
                <PlayerList players={players}></PlayerList>
            </>
        )
    }
    else{
        return(
            <>
                <p>{message}</p>
                <Form.Root className="FormRoot">
                    <NameField withButton={true}></NameField>
                </Form.Root>
            </>
        )
    }
}