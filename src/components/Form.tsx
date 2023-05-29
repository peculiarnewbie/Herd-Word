'use client'
import React from 'react';
import * as Form from '@radix-ui/react-form';
import './styles.css';

//@ts-ignore
const FormDemo = ({onClick}) => {
  //@ts-ignore
  const CallCreateRoom = async (event) => {
    event.preventDefault();
    console.log(event.target.room.value, event.target.name.value)

    const result = await onClick(event.target.room.value, event.target.name.value);
    const parsed = await JSON.parse(result).body;
    console.log(parsed)
  }
  
  return (
    <Form.Root onSubmit={CallCreateRoom} className="FormRoot">
      <Form.Field className="FormField" name="name">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Form.Label className="FormLabel">Name</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter your name
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input className="Input" required />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="room">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Form.Label className="FormLabel">Room</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter room code
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input className="Input" required />
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