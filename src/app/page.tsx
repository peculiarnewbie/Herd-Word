import Home from "../pages/page";
import Link from 'next/link'
import { Redis } from "@upstash/redis";

export default async function App(){
  const data = await getUpstash()
    return(
        <div>
      <h1>{data.props.thing.text}</h1>
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
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  });

  const thing = {text: "newone"} as MyPageProps;

  console.log("elo")
  const eyy = await redis.hset("teshash", {
      "ssr" : "emezing"
  });
  console.log(eyy)

  return {
      props: {
          thing
      }
  }
}