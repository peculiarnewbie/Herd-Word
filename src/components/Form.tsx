'use client'
import React, { useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { useRouter } from 'next/navigation';
import './styles.css';
import HomeNameField from './HomeNameField';
import FormButton from './FormButton';


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
    const playerIdForm = event.target.name.value;

    console.log(roomId, playerIdForm)

    if(playerIdForm !== undefined)
      router.push(`/${roomId}?playerId=${playerIdForm}`)
    else 
      router.push(`/${roomId}`)
  }

  const router = useRouter();
  
  return (
    <Form.Root onSubmit={CallCreateRoom} className="FormRoot">
      <HomeNameField playerId = {showName} setPlayerId={setShowName}></HomeNameField>
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
      <FormButton withButton={true}></FormButton>
    </Form.Root>
  )
};

export default FormDemo;