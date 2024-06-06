import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

cast.framework.CastReceiverContext.getInstance().start({
  customNamespaces: {
    "urn:x-cast:com.soulfire": cast.framework.system.MessageType.JSON
  },
  skipPlayersLoad: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>,
)
