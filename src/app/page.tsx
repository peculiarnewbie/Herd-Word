import Home from "../pages/page";
import Link from 'next/link'
import { Redis } from "@upstash/redis";

export default async function App(){
  const data = await getUpstash()
    return(
    <div>
      <h1>nvm</h1>
      <p>wtf</p>
    </div>
    )
}

type MyPageProps = {
  text: string;
}

async function getUpstash(){
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  });

  const thing = "cmooon";

  console.log("elo")
  const eyy = await redis.hset("teshash", {
      "ssr" : "lulknu"
  });
  console.log(eyy)

  return thing
}