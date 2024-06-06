import 'non.geist'
import {useEffect, useState} from "react";
import {Loader2Icon} from "lucide-react";

export default function App() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const context = cast.framework.CastReceiverContext.getInstance();

    const namespace = 'urn:x-cast:com.soulfiremc'
    const listener: SystemEventHandler = (customEvent) => {
      const message = `Received message: ${JSON.stringify(customEvent)}`

      setLogs((prevLogs) => {
        if (prevLogs.length === 0) {
            context.setApplicationState('Showing graphs')
        }

        return[...prevLogs, message]
      })
    }
    context.addCustomMessageListener(namespace, listener)

    const readyListener: SystemEventHandler = () => {
      context.sendCustomMessage(namespace, undefined, {
        message: 'Hello from Chromecast!'
      })
    }

    context.addEventListener(cast.framework.system.EventType.READY, readyListener)

    const options = new cast.framework.CastReceiverOptions();
    options.skipPlayersLoad = true
    options.customNamespaces = {
      [namespace]: cast.framework.system.MessageType.JSON,
    }

    context.setApplicationState('Loading')
    context.start(options)

    return () => {
      context.removeCustomMessageListener(namespace, listener)
      context.removeEventListener(cast.framework.system.EventType.READY, readyListener)
      context.stop()
    }
  }, []);

  return (
      <div className="h-screen w-screen flex">
        {
          logs.length === 0 ? (
              <div className="m-auto flex flex-col gap-4">
                <h1 className="text-2xl">SoulFire is loading...</h1>
                <div className="mx-auto">
                  <Loader2Icon className="animate-spin" size={32}/>
                </div>
              </div>
          ) : (
              <div className="m-auto flex flex-col gap-4">
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
  )
}
