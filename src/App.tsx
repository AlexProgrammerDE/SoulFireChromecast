import 'non.geist'
import {useEffect, useState} from "react";
import {Loader2Icon} from "lucide-react";

type RequestTypes = {
  type: "INITIAL_HELLO"
} | {
  type: "CHALLENGE_RESPONSE",
  challenge: string
} | {
  type: "DISPLAY_LOGS",
  logs: string[]
}

type ResponseTypes = {
  type: "CHALLENGE_REQUEST",
  challenge: string
} | {
  type: "LOGIN_SUCCESS",
} | {
  type: "GENERIC_MESSAGE",
  message: string
}

export default function App() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const sharedChallenge = Math.random().toString(36)
    const context = cast.framework.CastReceiverContext.getInstance();
    const sendMessageToSender = (message: ResponseTypes) => {
      context.sendCustomMessage(namespace, undefined, message)
    }

    const namespace = 'urn:x-cast:com.soulfiremc'
    const listener: SystemEventHandler = (customEvent) => {
      const data = (customEvent as unknown as { data: RequestTypes }).data
      switch (data.type) {
        case "INITIAL_HELLO":
          sendMessageToSender({
            type: 'CHALLENGE_REQUEST',
            challenge: sharedChallenge
          })
          break
        case "CHALLENGE_RESPONSE":
          if (data.challenge === sharedChallenge) {
            context.setApplicationState('Showing graphs')
            sendMessageToSender({
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
      sendMessageToSender({
        type: 'GENERIC_MESSAGE',
        message: 'Hello from Chromecast!'
      })
    }

    const connectListener: SystemEventHandler = event => {
      setLogs((prevLogs) => [...prevLogs, `Sender connected ${JSON.stringify(event)}`])
    }

    const disconnectListener: SystemEventHandler = event => {
      setLogs((prevLogs) => [...prevLogs, `Sender disconnected ${JSON.stringify(event)}`])
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
