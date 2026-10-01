import Timer from '../components/Timer.jsx'
import { OPTION_LETTERS } from '../components/options.js'

/**
 * Host question screen (projector): big question, options, timer,
 * and a live count of how many students have answered.
 *
 * Props:
 *   question   { index, total, text, options, timeLimit, deadline }
 *   answered   how many players have answered so far
 *   players    total number of players
 *   onReveal   called when the host skips ahead to the results
 */
export default function HostQuestion({ question, answered, players, onReveal }) {
  const allIn = players > 0 && answered >= players

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col">
        <div className="flex items-center justify-between text-lg text-muted">
          <span>
            Question {question.index + 1} of {question.total}
          </span>
          <span aria-live="polite">
            <span className={`text-3xl font-bold ${allIn ? 'text-correct' : 'text-white'}`}>
              {answered}
            </span>
            /{players} answered
          </span>
        </div>

        <h1 className="mt-8 text-4xl md:text-6xl font-bold leading-tight">{question.text}</h1>

        <div className="mt-8">
          <Timer deadline={question.deadline} timeLimit={question.timeLimit} size="lg" />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {question.options.map((option, i) => (
            <div
              key={i}
              className="flex min-h-24 items-center gap-4 rounded-2xl bg-option p-6
                         text-2xl md:text-3xl font-semibold text-option-text"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-option-key text-xl text-accent">
                {OPTION_LETTERS[i]}
              </span>
              {option}
            </div>
          ))}
        </div>

        <div className="mt-auto flex justify-end pt-8">
          <button
            type="button"
            onClick={onReveal}
            className="rounded-xl border border-track px-6 py-3 font-semibold text-muted
                       hover:border-accent hover:text-white transition"
          >
            Show results now
          </button>
        </div>
      </div>
    </main>
  )
}
