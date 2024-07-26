import 'non.geist'
import {useEffect, useState} from "react";
import {Loader2Icon} from "lucide-react";

type MessageTypes = {
  type: "INITIAL_HELLO"
} | {
  type: "CHALLENGE_RESPONSE",
  challenge: string
} | {
  type: "DISPLAY_LOGS",
  logs: string[]
}

export default function App() {
  const [logs, setLogs] = useState<string[]>([])
  const [lastConnect, setLastConnect] = useState<Date>()

  useEffect(() => {
    const sharedChallenge = Math.random().toString(36)
    const context = cast.framework.CastReceiverContext.getInstance();

    const namespace = 'urn:x-cast:com.soulfiremc'
    const listener: SystemEventHandler = (customEvent) => {
      const data = (customEvent as unknown as { data: MessageTypes }).data
      switch (data.type) {
        case "INITIAL_HELLO":
          context.sendCustomMessage(namespace, undefined, {
            type: 'CHALLENGE_REQUEST',
            challenge: sharedChallenge
          })
          break
        case "CHALLENGE_RESPONSE":
          if (data.challenge === sharedChallenge) {
            context.setApplicationState('Showing graphs')
            context.sendCustomMessage(namespace, undefined, {
              type: 'LOGIN_SUCCESS'
            })
          } else {
            context.setApplicationState('Invalid challenge')
          }
          break
        case "DISPLAY_LOGS":
          setLogs((prevLogs) => [...prevLogs, ...data.logs])
          break
      }
    }
    context.addCustomMessageListener(namespace, listener)

    const readyListener: SystemEventHandler = () => {
      context.sendCustomMessage(namespace, undefined, {
        message: 'Hello from Chromecast!'
      })
    }

    const connectListener: SystemEventHandler = event => {
      setLogs((prevLogs) => [...prevLogs, `Sender connected ${JSON.stringify(event.data)}`])
    }

    const disconnectListener: SystemEventHandler = () => {
      setLogs((prevLogs) => [...prevLogs, `Sender disconnected ${JSON.stringify(event.data)}`])
    }

    context.addEventListener(cast.framework.system.EventType.READY, readyListener)
    context.addEventListener(cast.framework.system.EventType.SENDER_CONNECTED, connectListener)
    context.addEventListener(cast.framework.system.EventType.SENDER_DISCONNECTED, disconnectListener)

    const options = new cast.framework.CastReceiverOptions();
    options.skipPlayersLoad = true
    options.disableIdleTimeout = true
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
