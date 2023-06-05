import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import NameField from '@/components/NameField';
import FormButton from '@/components/FormButton';
import { useState } from 'react';
import RoomParams from './RoomParams';


export default function CreateRoom({roomId, playerId} : {roomId:any, playerId:string}){

  
  const [isHerd, setIsHerd] = useState(true);

    //@ts-ignore
    const CallCreateRoom = async (event) =>{
        event.preventDefault();

        console.log(event.target.herdEndCondition.getAttribute('aria-valuenow'))
        console.log(event.target.herdScoreTarget)

        const hotJoinable = event.target.hotJoinable['data-state']

        let params = {}

        if(isHerd)

        console.log("creating room");
    
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "text/plain");
        
        // var raw = JSON.stringify({
        //     "roomId": `${roomId}`,
        //     "userId": `${playerId}`,
        //     "input": `${input}`
        //   });
        
        // var requestOptions = {
        //   method: 'POST',
        //   headers: myHeaders,
        //   body: raw,
        //   next: { revalidate: 0 }
        // };
        
        // //@ts-ignore
        // const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/roomactions/sendinput", requestOptions)
        //   .then(response => response.text())

        

        // console.log(JSON.parse(result).body)
    }

    

    if(roomId){
      return(
        <>
          <p>creating a room with id: {roomId}</p>
          <Form.Root className="FormRoot" onSubmit={CallCreateRoom}>
              <RoomParams></RoomParams>
              <FormButton withButton={true} label='Create Room'></FormButton>
          </Form.Root>
        </>
      )
    }

    return(
      <>
        <p>aloo</p>
        <Form.Root className="FormRoot" onSubmit={CallCreateRoom}>
            <NameField withButton={false} label='Room Name' message='Please enter room name'></NameField>
            
            <FormButton withButton={true} label='Create Room'></FormButton>
        </Form.Root>
      </>
    )
}