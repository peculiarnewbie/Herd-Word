'use client'
import TextInput from "@/components/TextInput";
import TestButton from "@/components/TestButton";
import Link from 'next/link'
import { Redis } from "@upstash/redis";
import FormDemo from "@/components/Form";
import CustomForm from "@/components/CustomForm";
import { cookies } from 'next/headers';
import './[room]/styles.css'
import CustomCheckbox from "@/components/CustomCheck";

// let roomId = ""
// let playerId = ""

export default function App(){

  const playerId = localStorage.getItem('playerId');
  
    return(
      <div className="BG">
        <CustomCheckbox checkState={true}></CustomCheckbox>

        <div className="WebRoot">
          
          
          
          <h1>Welcome folks</h1>
          <Link href="/page">
            page
          </Link>

          <div style={{display: 'flex', minWidth:'300px', width: '50%'}}>

            <FormDemo playerId = {playerId}></FormDemo>
          </div>

          {/* <form onSubmit={CallCreateRoom}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="name">Room</label>
          <input type="text" id="roomName" name="room" required />
          <button type="submit">Add to Cart</button>
          </form> */}
        </div>
      </div>

    )
}