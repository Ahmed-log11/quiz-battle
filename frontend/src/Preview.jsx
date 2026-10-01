import { useState } from 'react'
import Welcome from './Welcome.jsx'
import HostLobby from './host/HostLobby.jsx'
import HostQuestion from './host/HostQuestion.jsx'
import HostResult from './host/HostResult.jsx'
import HostFinal from './host/HostFinal.jsx'
import PlayerLobby from './play/PlayerLobby.jsx'
import Question from './play/Question.jsx'
import Result from './play/Result.jsx'
import Final from './play/Final.jsx'

/*
 * Preview of every screen with fake data, at #/preview.
 * Use it to check the design without running a game.
 * Delete this file (and its route in App.jsx) before the final version.
 */

const NAMES = ['Sara', 'Abdullah', 'Noura', 'Faisal', 'Reem', 'Omar', 'Lama', 'Khalid', 'Hessa', 'Yousef', 'Maha', 'Turki']

const LEADERBOARD = NAMES.map((name, i) => ({ name, score: 5200 - i * 380 - (i % 3) * 45 }))

const BASE_QUESTION = {
  index: 2,
  total: 10,
  text: 'What does len([1, 2, 3]) return?',
  options: ['2', '3', '4', 'Error'],
  timeLimit: 20,
}

const SCREENS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'host-lobby', label: 'Host lobby' },
  { id: 'player-lobby', label: 'Player lobby' },
  { id: 'host-question', label: 'Host question' },
  { id: 'player-question', label: 'Player question' },
  { id: 'host-result', label: 'Host result' },
  { id: 'player-result', label: 'Player result' },
  { id: 'host-final', label: 'Host final' },
  { id: 'player-final', label: 'Player final' },
]

function renderScreen(id, deadline) {
  const question = { ...BASE_QUESTION, deadline }

  switch (id) {
    case 'welcome':
      return <Welcome onJoin={console.log} onHost={() => {}} />
    case 'host-lobby':
      return (
        <HostLobby
          code="KQZT"
          players={NAMES.map((name, i) => ({ name, connected: i !== 4 }))}
          onStart={() => {}}
        />
      )
    case 'player-lobby':
      return <PlayerLobby name="Sara" code="KQZT" />
    case 'host-question':
      return <HostQuestion question={question} answered={18} players={25} onReveal={() => {}} />
    case 'player-question':
      return <Question key={deadline} question={question} onAnswer={console.log} />
    case 'host-result':
      return (
        <HostResult
          question={question}
          correctOption={1}
          fastest={{ name: 'Noura', seconds: 2.4 }}
          correctCount={17}
          players={25}
          leaderboard={LEADERBOARD}
          isLast={false}
          onNext={() => {}}
        />
      )
    case 'player-result':
      return (
        <Result
          name="Sara"
          result={{
            answered: true,
            correct: true,
            points: 870,
            score: 5200,
            rank: 1,
            totalPlayers: 25,
            streak: 3,
            correctAnswer: '3',
            fastestName: 'Noura',
          }}
        />
      )
    case 'host-final':
      return (
        <HostFinal
          leaderboard={LEADERBOARD}
          awards={[
            { title: 'Biggest streak', name: 'Sara', detail: '7 in a row' },
            { title: 'Fastest on average', name: 'Noura', detail: '3.1s per answer' },
            { title: 'Most fastest answers', name: 'Faisal', detail: 'Fastest on 4 questions' },
          ]}
          csvUrl="#"
          onNewGame={() => {}}
        />
      )
    case 'player-final':
      return (
        <Final
          name="Sara"
          final={{ rank: 1, totalPlayers: 25, score: 5200, correctCount: 8, totalQuestions: 10, bestStreak: 7 }}
        />
      )
    default:
      return null
  }
}

export default function Preview() {
  const [screen, setScreen] = useState('welcome')
  const [deadline, setDeadline] = useState(() => Date.now() + 20000)

  function show(id) {
    setScreen(id)
    setDeadline(Date.now() + 20000) // restart the timer on each switch
  }

  return (
    <>
      <nav className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-track bg-bg/95 p-2">
        {SCREENS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => show(s.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition
                        ${screen === s.id ? 'bg-accent text-white' : 'text-muted hover:text-white'}`}
          >
            {s.label}
          </button>
        ))}
      </nav>
      <div key={screen}>{renderScreen(screen, deadline)}</div>
    </>
  )
}
