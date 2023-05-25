"use client"
import Home from "../pages/page";
import TextInput from "@/components/TextInput";
import TestButton from "@/components/TestButton";
import Link from 'next/link'
import { Redis } from "@upstash/redis";
import { useState } from "react";
import * as Form from '@radix-ui/react-form';

let roomId = ""
let playerId = ""

export default function App(){
  // const [roomId, setRoomId] = useState("null")
  // const [playerId, setPlayerId] = useState("null");

  const CreateRoom = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    
    var raw = JSON.stringify({
      "roomId": `${roomId}`,
      "userId": `${playerId}`
    });
    
    var requestOptions = {
      method: 'POST',
      mode: 'no-cors',
      headers: myHeaders,
      body: raw
    };
    
    //@ts-ignore
    fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/tryagane", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
    return(
    <div>
      
      <h1>Welcome bitches</h1>
      <Link href="/page">
        page
      </Link>

      <Form.Root onSubmit={(event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        console.log("submitting", data);
        //@ts-ignore
        roomId = data.roomId
        //@ts-ignore
        playerId = data.playerId
        CreateRoom()
      }} className="FormRoot">
        <Form.Field className="FormField" name="playerId">
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
        <Form.Field className="FormField" name="roomId">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Room ID</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter a question
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
    </div>
    )
}