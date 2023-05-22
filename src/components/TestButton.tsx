import React, { useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import './styles.css';
import pubTest from '../pages/api/v1/pubTest.js';
import Ably from 'ably'

export function TestButton({AblyTest}){

  return(
    <button className="Button" onClick={AblyTest}>
      TestPub
    </button>
  )
};

const CallTest = async (channel:any) => {
  await channel.publish('greeting', 'hello!');
}



export default TestButton;