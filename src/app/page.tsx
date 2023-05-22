import Home from "../pages/page";
import Link from 'next/link'

export default function App(){
    return(
        <div>
      <h1>Welcome to my app</h1>
      <Link href="/page">
        page
      </Link>
    </div>
    )
}