'use client'
import React, { useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { useRouter } from 'next/navigation';
import './styles.css';
import NameField from './NameField';


//@ts-ignore
const FormDemo = ({playerId}) => {
  const [showName, setShowName] = useState("null");
  

  useEffect(() => {
    if(playerId) setShowName(playerId)
    else setShowName("null")
  }, [])

  //@ts-ignore
  const CallCreateRoom = async (event) => {
    event.preventDefault();
    const roomId = event.target.room.value;
    const playerId = event.target.name.value;

    console.log(roomId, playerId)

    router.push(`/${roomId}?playerId=${playerId}`)
  }

  const router = useRouter();
  
  return (
    <Form.Root onSubmit={CallCreateRoom} className="FormRoot">
      <NameField playerId = {showName} setPlayerId={setShowName}></NameField>
      <Form.Field className="FormField" name="room">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Form.Label className="FormLabel">Room</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter room code
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input className="Input" />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button className="Button" style={{ marginTop: 10 }}>
          Continue
        </button>
      </Form.Submit>
    </Form.Root>
  )
};

export default FormDemo;