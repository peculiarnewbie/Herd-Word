import React from 'react';
import * as Form from '@radix-ui/react-form';
import './styles.css';
import { Redis } from "@upstash/redis";
import pubTest from '../pages/api/v1/pubTest.js';

const TestButton = () => (

  <button className="Button" onClick={CallTest}>
    TestPub
  </button>
);

const CallTest = async () => {
    console.log("calling test")
    pubTest();
}

export default TestButton;