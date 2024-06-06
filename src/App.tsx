import 'non.geist'
import {useEffect, useState} from "react";
import {Loader2Icon} from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const namespace = 'urn:x-cast:com.soulfire'
    const listener: SystemEventHandler = (customEvent) => {
      // Set to not loading if it is loading
      setLoading(current => {
        if (current) {
          return false
        }

        return current
      })

      setLogs((prevLogs) => [...prevLogs, JSON.stringify(customEvent, null, 2)])
    }
    cast.framework.CastReceiverContext.getInstance().addCustomMessageListener(namespace, listener)

    return () => {
      cast.framework.CastReceiverContext.getInstance().removeCustomMessageListener(namespace, listener)
    }
  }, []);

  return (
      <>
        <div className="h-screen w-screen flex">
          {
            loading ? (
                <div className="m-auto flex flex-col gap-8">
                  <h1 className="text-2xl">SoulFire is loading...</h1>
                  <div className="mx-auto">
                    <Loader2Icon className="animate-spin" size={32}/>
                  </div>
                </div>
            ) : (
                <div className="m-auto">
                  <h1 className="text-3xl">SoulFire is ready!</h1>
                  <div className="overflow-auto h-96 w-96 border border-gray-300 rounded-lg">
                    <ul className="p-4">
                      {logs.map((log, index) => (
                          <li key={index} className="p-2 border-b border-gray-300">{log}</li>
                      ))}
                    </ul>
                  </div>
                </div>
            )
          }
        </div>
      </>
  )
}
