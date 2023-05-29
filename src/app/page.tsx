

import TextInput from "@/components/TextInput";
import TestButton from "@/components/TestButton";
import Link from 'next/link'
import { Redis } from "@upstash/redis";
import * as Form from '@radix-ui/react-form';
import CustomForm from "@/components/CustomForm";

// let roomId = ""
// let playerId = ""

export default function App(){
  

  //@ts-ignore
  // const CallCreateRoom = async (event) => {
  //   event.preventDefault();
  //   roomId = event.target.name.value;
  //   playerId = event.target.room.value;

  //   await CreateRoom();
  // }
  const CreateRoom = async (roomId, playerId) => {
    'use server';
    
    console.log("at server", roomId, playerId);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    
    var raw = JSON.stringify({
      "roomId": `"${roomId}"`,
      "userId": `"${playerId}"`
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
    
    //@ts-ignore
    const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/createroom", requestOptions)
      .then(response => response.text())

    console.log(result);
    return result;
  }
    return(
    <div>
      
      <h1>Welcome folks</h1>
      <Link href="/page">
        page
      </Link>

      <CustomForm onClick={CreateRoom}></CustomForm>

      {/* <form onSubmit={CallCreateRoom}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="name">Room</label>
      <input type="text" id="roomName" name="room" required />
        <button type="submit">Add to Cart</button>
      </form> */}
    </div>
    )
}