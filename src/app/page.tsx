import Home from "../pages/page";
import Link from 'next/link'
import { Redis } from "@upstash/redis";

export default async function App(){
  const data = await getUpstash()
    return(
    <div>
      
      <h1>{data}</h1>
      <Link href="/page">
        page
      </Link>
    </div>
    )
}

type MyPageProps = {
  text: string;
}

async function getUpstash(){
  
  const redis = Redis.fromEnv();
  const data = await redis.set("grrreat", "bartt");

  return data
}