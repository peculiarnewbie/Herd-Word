import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import NameField from '@/components/NameField';
import FormButton from '@/components/FormButton';
import { useState } from 'react';
import RoomParams from './RoomParams';


export default function CreateRoom({roomId, playerId} : {roomId:any, playerId:string}){

  const [hotJoinable, setHotJoinable] = useState(true);

    //@ts-ignore
    const CallCreateRoom = async (event) =>{
        event.preventDefault();

        const input = event.target.answer.value

        console.log("sending input");
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        
        var raw = JSON.stringify({
            "roomId": `${roomId}`,
            "userId": `${playerId}`,
            "input": `${input}`
          });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          next: { revalidate: 0 }
        };
        
        //@ts-ignore
        const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/roomactions/sendinput", requestOptions)
          .then(response => response.text())

        

        console.log(JSON.parse(result).body)
    }

    const HandleHotJoinCheckBox = (event:any) => {
      console.log("changing state")
      setHotJoinable(!hotJoinable)
    }

    if(roomId){
      return(
        <>
          <p>creating a room with id: {roomId}</p>
          <Form.Root className="FormRoot" onSubmit={CallCreateRoom}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox.Root className="CheckboxRoot" defaultChecked id="c1" checked={hotJoinable} onCheckedChange={HandleHotJoinCheckBox}>
                  <Checkbox.Indicator className="CheckboxIndicator">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label className="Label" htmlFor="c1">
                  Allow hot-joining
                </label>
              </div>
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox.Root className="CheckboxRoot" defaultChecked id="c1" checked={hotJoinable} onCheckedChange={HandleHotJoinCheckBox}>
                <Checkbox.Indicator className="CheckboxIndicator">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label className="Label" htmlFor="c1">
                Allow hot-joining
              </label>
            </div>
            <FormButton withButton={true} label='Create Room'></FormButton>
        </Form.Root>
      </>
    )
}