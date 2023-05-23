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
  const data = await fetch("https://joint-bullfrog-35191.upstash.io/set/foo/bar", {
  headers: {
    Authorization: "Bearer ********"
  }
}).then(response => response.json())
  .then(data => console.log(data));

  const thing = "yooo";

  return thing
}