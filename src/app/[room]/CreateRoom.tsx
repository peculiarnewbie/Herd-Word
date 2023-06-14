import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import NameField from '@/components/NameField';
import FormButton from '@/components/FormButton';
import { useState } from 'react';
import RoomParams from './RoomParams';

export interface GameParams {
  gameType: string;
  endCondition: string;
  endTarget: string;
  onlyHighest?: boolean;
  useOddOneOut?: boolean;
  questionSets?: string[];
  isElimination?: boolean;

}

export default function CreateRoom({roomId, playerId, loading, setLoading, setJoined, setCreatingRoom, setIsMaster, setMessage} : {roomId:any, playerId:string | null, loading:boolean, setLoading:any, setJoined:any, setCreatingRoom:any, setIsMaster:any, setMessage:any}){

    //@ts-ignore
    const CallCreateRoom = async (event) =>{
        event.preventDefault();

        setLoading(true);

        const hotJoinable = event.target.hotJoinable.dataset.state == 'checked' ? true : false
        let gameType = 'sb'
        const mode = event.target.gameType.getAttribute('aria-valuenow')
        if(mode == '0' || mode == '1') gameType = 'herd'

        let gameParams : GameParams = {gameType : gameType, endCondition : '0', endTarget: '15'}

        if(gameType == 'herd'){
          let herdEndCondition
          if(mode == '1'){
            herdEndCondition = event.target.herdEndCondition.getAttribute('aria-valuenow')
          }
          else herdEndCondition = '0'

          gameParams.endCondition = herdEndCondition

          if(herdEndCondition == '0'){
            gameParams.endTarget = '15'
            gameParams.onlyHighest = true;
            gameParams.useOddOneOut = false;
          } 
          else{
            gameParams.endTarget = event.target.herdScoreTarget
            gameParams.onlyHighest = event.target.onlyHighest.dataset.state == 'checked' ? true : false
            gameParams.useOddOneOut = event.target.useOddOneOut.dataset.state == 'checked' ? true : false
          } 

          gameParams.questionSets = ['icameup', 'curatedofficial', 'curatedfeud']

        }

        console.log("creating room");
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        
        var raw = JSON.stringify({
            "roomId": `${roomId}`,
            "userId": `${playerId}`,
            "hotJoinable": `${hotJoinable}`,
            "params": gameParams
          });

        console.log(raw);
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          next: { revalidate: 0 }
        };
        
        //@ts-ignore
        const result = await fetch("https://ng51i1t4j1.execute-api.ap-southeast-1.amazonaws.com/Prod/createroom", requestOptions)
          .then(response => response.text())

        const parsed = JSON.parse(result);

        if(parsed.statusCode == 200){
          setJoined(true);
          setCreatingRoom(false);
          setIsMaster(true);
          setLoading(false);
          localStorage.setItem('playerId', playerId ? playerId : '')
        }

        console.log(JSON.parse(result).body)

        
    }

    if(loading){
        return(
            <p>loading...</p>
        )
    }

    else if(roomId){
      return(
        <div className='CreateRoom'>
          <p>creating a room with id: {roomId}</p>
          <Form.Root className="FormRoot" onSubmit={CallCreateRoom}>
              <div className='RoomParams'>
                <RoomParams></RoomParams>
              </div>
              <FormButton withButton={true} label='Create Room'></FormButton>
          </Form.Root>
        </div>
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