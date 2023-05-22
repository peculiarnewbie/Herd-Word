import React from 'react';
import * as Form from '@radix-ui/react-form';
import './styles.css';
import { Redis } from "@upstash/redis";

const TestButton = () => (

  <button className="Button" onClick={CallTest}>
    TestPub
  </button>
);

const CallTest = async () => {
    const redis = Redis.fromEnv();
    redis.hset("teshash", {
        "aloo" : "hiyaa"
    });
    console.log("calling test")
    await fetch("../pages/api/v1/pubTest", {
        method: "GET"
        })
}

export default TestButton;