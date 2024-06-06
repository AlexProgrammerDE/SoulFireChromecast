import 'non.geist'
import {useState} from "react";
import {Loader2Icon} from "lucide-react";

export default function App() {
  const [loading, ] = useState(true)

  return (
    <>
      <div className="h-screen w-screen flex">
        {
          loading ? (
            <div className="m-auto flex flex-col gap-8">
              <h1 className="text-3xl">SoulFire is loading...</h1>
              <div className="mx-auto">
                <Loader2Icon className="animate-spin" size={48} />
              </div>
            </div>
          ) : (
            <div className="m-auto">
              <div className="text-3xl">Hello World!</div>
            </div>
          )
        }
      </div>
    </>
  )
}
