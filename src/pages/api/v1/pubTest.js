import { NextRequest, NextResponse } from "next/server";
import { UpstashRequest, Requester, UpstashResponse, Redis } from "@upstash/redis"




export default async function pubTest() {
    const redis = new Redis({
        url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
        token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
    });
    
    console.log("elo")
    redis.hset("teshash", {
        "aloo" : "hiyaa"
    });
}