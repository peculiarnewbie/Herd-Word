import Home from "../pages/page";
import Link from 'next/link'
import { Redis } from "@upstash/redis";

export default async function App(){
  const data = await getUpstash()
    return(
    <div>
      
      <h1>{data.result}</h1>
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
  const data = await fetch("https://joint-bullfrog-35191.upstash.io/get/foo/", {
  headers: {
    Authorization: process.env.UPSTASH_REDIS_REST_TOKEN as string
  },
  next: {revalidate: 10, tags: ['collection']}
}).then(response => response.json());

  const thing = "yooo";

  return data
}