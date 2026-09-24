import { connectToServer } from './socket-client'
import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div>

      <h1>Websocket - Client</h1>
      <span id="server-status">offline</span>

      <ul id="clients-ul">
        
      </ul>

      <form id="message-form">
        <input placeholder="Message" id="message-input" />
      </form>

    </div>
  </div>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
connectToServer();