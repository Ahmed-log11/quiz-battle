import useGameSocket from '../useGameSocket.js'
import HostLobby from './HostLobby.jsx'
import HostQuestion from './HostQuestion.jsx'
import HostResult from './HostResult.jsx'
import HostFinal from './HostFinal.jsx'

const HOST_JOIN = { type: 'join', role: 'host' }

/**
 * Host screen (projector) at #/host: owns the WebSocket and shows
 * the right screen for the current phase of the game.
 */
export default function HostFlow() {
  const { state, send } = useGameSocket(HOST_JOIN)

  if (!state) {
    return (
      <main className="min-h-screen grid place-items-center p-4 text-muted">
        Connecting to the server…
      </main>
    )
  }

  const playerCount = state.players.length
  const next = () => send({ type: 'next' })

  switch (state.phase) {
    case 'lobby':
      return <HostLobby code={state.code} players={state.players} onStart={() => send({ type: 'start' })} />
    case 'question':
      return (
        <HostQuestion
          key={state.index}
          question={state.question}
          answered={state.answered}
          players={playerCount}
          onReveal={next}
        />
      )
    case 'reveal':
      return (
        <HostResult
          question={state.question}
          correctOption={state.reveal.correctOption}
          correctAnswer={state.reveal.correctAnswer}
          fastest={state.reveal.fastest}
          correctCount={state.reveal.correctCount}
          players={playerCount}
          leaderboard={state.leaderboard}
          isLast={state.index === state.total - 1}
          onNext={next}
        />
      )
    case 'finished':
      return (
        <HostFinal
          leaderboard={state.leaderboard}
          awards={state.awards}
          onNewGame={() => send({ type: 'reset' })}
        />
      )
    default:
      return null
  }
}