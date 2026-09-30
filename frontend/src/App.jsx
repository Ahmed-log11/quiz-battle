import { useEffect, useState } from 'react'

// Connect to the same site the page came from, so this works locally
// (through the Vite proxy) and on the deployed link without changes.
function socketUrl() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${location.host}/ws`
}

function App() {
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const socket = new WebSocket(socketUrl())
    socket.onopen = () => {
      setStatus('connected')
      socket.send(JSON.stringify({ type: 'ping' }))
    }
    socket.onclose = () => setStatus('disconnected')
    socket.onerror = () => setStatus('disconnected')
    return () => socket.close()
  }, [])

  return (
    <main>
      <h1>Quiz Battle</h1>
      <p>
        Server: <span className={`status ${status}`}>{status}</span>
      </p>
    </main>
  )
}

export default App
