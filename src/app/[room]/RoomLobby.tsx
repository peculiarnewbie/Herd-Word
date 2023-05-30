import PlayerList from "./PlayerList";
import NameField from "@/components/NameField";
import * as Form from '@radix-ui/react-form';


export default function RoomLobby({joined, message, players }: {joined:boolean, message:string, players:string[]}){
    
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