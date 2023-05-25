import React, { useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import './styles.css';
import pubTest from '../pages/api/v1/pubTest.js';
import Ably from 'ably'

//@ts-ignore
export function TestButton({FunctionToCall}){

  return(
    <button className="Button" onClick={FunctionToCall}>
      TestPub
    </button>
  )
};



export default TestButton;