import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req: NextRequest) {
    redis.hset("teshash", {
        "aloo" : "hiyaa"
    });
}