import { useState } from 'react'
import useGameSocket from '../useGameSocket.js'
import Welcome from '../Welcome.jsx'
import PlayerLobby from './PlayerLobby.jsx'
import Question from './Question.jsx'
import Result from './Result.jsx'
import Final from './Final.jsx'

// Remembered on the phone so a refresh or a locked screen doesn't kick the player out.
// Storage can fail (private mode), so every read and write is wrapped in try/catch.
const SAVED_KEY = 'quiz-battle-player'
const ID_KEY = 'quiz-battle-id'

function loadPlayer() {
  try {
    return JSON.parse(sessionStorage.getItem(SAVED_KEY))
  } catch {
    return null
  }
}

function savePlayer(player) {
  try {
    if (player) sessionStorage.setItem(SAVED_KEY, JSON.stringify(player))
    else sessionStorage.removeItem(SAVED_KEY)
  } catch {
    // ignore: the game still works, only reconnecting after a refresh won't
  }
}

// Random id for this tab, so the server lets the same tab take its name back after a refresh.
// sessionStorage (not localStorage) so two tabs in one browser are two different players.
// (crypto.randomUUID only works on https, and phones use http during development)
function playerId() {
  const fresh = Math.random().toString(36).slice(2) + Date.now().toString(36)
  try {
    const saved = sessionStorage.getItem(ID_KEY)
    if (saved) return saved
    sessionStorage.setItem(ID_KEY, fresh)
  } catch {
    // ignore
  }
  return fresh
}

const PLAYER_ID = playerId()

/**
 * Student screens (#/play and the home page): join form, then
 * lobby -> question -> result -> ... -> final, driven by the server.
 */
export default function PlayerFlow({ onHost }) {
  const [player, setPlayer] = useState(loadPlayer) // { code, name } after joining
  const [error, setError] = useState('')

  const join = player && { type: 'join', role: 'player', name: player.name, code: player.code, id: PLAYER_ID }
  const { state, send } = useGameSocket(join, (message) => {
    setError(message)
    setPlayer(null)
    savePlayer(null)
  })

  function handleJoin({ code, name }) {
    setError('')
    setPlayer({ code, name })
    savePlayer({ code, name })
  }

  if (!player || !state) {
    return <Welcome onJoin={handleJoin} onHost={onHost} serverError={error} joining={Boolean(player)} />
  }

  const { me } = state
  switch (state.phase) {
    case 'lobby':
      return <PlayerLobby name={me.name} code={state.code} />
    case 'question':
      return (
        <Question
          key={state.index}
          question={state.question}
          initialChoice={me.choice}
          onAnswer={(choice) => send({ type: 'answer', choice })}
        />
      )
    case 'reveal':
      return <Result name={me.name} result={me.result} />
    case 'finished':
      return <Final name={me.name} final={me.final} />
    default:
      return null
  }
}
