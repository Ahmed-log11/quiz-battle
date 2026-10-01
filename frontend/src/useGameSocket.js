import { useCallback, useEffect, useRef, useState } from 'react'

// Connect to the same site the page came from, so this works locally
// (through the Vite proxy) and on the deployed link without changes.
function socketUrl() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${location.host}/ws`
}

// Close code the server uses when a newer connection takes over this player
const REPLACED = 4000

// The server sends the time left; turn it into a deadline on this device's clock
function withDeadline(state) {
  if (!state.question) return state
  const deadline = Date.now() + state.question.timeLeftMs
  return { ...state, question: { ...state.question, deadline } }
}

/**
 * Opens the game WebSocket, sends the join message, and keeps the latest state.
 * If the connection drops (e.g. a phone screen locks), it reconnects and joins again.
 *
 *   join        the join message to send, or null to stay disconnected
 *   onRejected  called with the server's message if it refuses the join
 *
 * Returns { state, send }: state is null until the server accepts the join.
 */
export default function useGameSocket(join, onRejected) {
  const [state, setState] = useState(null)
  const socketRef = useRef(null)
  const joinRef = useRef(join)
  const rejectedRef = useRef(onRejected)
  const enabled = join !== null

  useEffect(() => {
    joinRef.current = join
    rejectedRef.current = onRejected
  })

  useEffect(() => {
    if (!enabled) return
    let socket
    let retry
    let stopped = false

    function connect() {
      socket = new WebSocket(socketUrl())
      socketRef.current = socket
      let joined = false

      socket.onopen = () => socket.send(JSON.stringify(joinRef.current))
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.type === 'state') {
          joined = true
          setState(withDeadline(msg))
        } else if (msg.type === 'error' && !joined) {
          stopped = true
          socket.close()
          setState(null)
          rejectedRef.current?.(msg.message)
        }
      }
      socket.onclose = (event) => {
        if (event.code === REPLACED) {
          // the same player opened the game somewhere else: stop, don't fight over the name
          stopped = true
          setState(null)
          rejectedRef.current?.(event.reason || 'You joined from another tab')
        } else if (!stopped) {
          retry = setTimeout(connect, 1000)
        }
      }
    }

    connect()
    return () => {
      stopped = true
      clearTimeout(retry)
      socket.close()
    }
  }, [enabled])

  const send = useCallback((msg) => {
    const socket = socketRef.current
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(msg))
  }, [])

  return { state, send }
}
