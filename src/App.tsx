import 'non.geist'
import {useEffect, useState} from "react";
import {Loader2Icon} from "lucide-react";

export default function App() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const context = cast.framework.CastReceiverContext.getInstance()
    const castDebugLogger = cast.debug.CastDebugLogger.getInstance();
    const LOG_TAG = 'MyAPP.LOG';

    context.addEventListener(cast.framework.system.EventType.READY, () => {
      if (!(castDebugLogger as unknown as {debugOverlayElement_: object}).debugOverlayElement_) {
        castDebugLogger.setEnabled(true);

        // Show debug overlay.
        castDebugLogger.showDebugLogs(true);
      }
    });

    const namespace = 'urn:x-cast:com.soulfiremc'
    const listener: SystemEventHandler = (customEvent) => {
      castDebugLogger.info(LOG_TAG, `Received message: ${JSON.stringify(customEvent, null, 2)}`)
      setLogs((prevLogs) => [...prevLogs, JSON.stringify(customEvent, null, 2)])
    }
    context.addCustomMessageListener(namespace, listener)

    context.start({
      skipPlayersLoad: true,
    })

    castDebugLogger.info(LOG_TAG, 'Started app...')
    return () => {
      context.removeCustomMessageListener(namespace, listener)
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
