import { useState } from 'react'
import Timer from '../components/Timer.jsx'
import { OPTION_LETTERS } from '../components/options.js'

/**
 * Player question screen: four answer buttons and the countdown.
 * One answer per question: after tapping, the choice is locked in.
 *
 * Give this component key={question.index} in the parent so the
 * selection resets automatically for each new question.
 *
 * Props:
 *   question   { index, total, text, options, timeLimit, deadline }
 *   onAnswer   called with the chosen option index (0-3)
 */
export default function Question({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const locked = selected !== null

  function choose(i) {
    if (locked) return
    setSelected(i)
    onAnswer?.(i)
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-2xl flex-col">
        <p className="text-sm text-muted">
          Question {question.index + 1} of {question.total}
        </p>
        <h1 className="mt-2 text-xl md:text-3xl font-bold">{question.text}</h1>

        <div className="mt-4">
          <Timer deadline={question.deadline} timeLimit={question.timeLimit} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            const isSelected = selected === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={isSelected}
                className={`group flex min-h-16 items-center gap-3 rounded-xl border-2 p-4
                            text-left text-lg font-semibold transition active:scale-[0.98]
                            ${isSelected
                              ? 'border-gold bg-accent text-white'
                              : locked
                                ? 'border-transparent bg-option/40 text-option-text'
                                : 'border-transparent bg-option text-option-text hover:bg-accent hover:text-white'}`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm
                              ${isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-option-key text-accent group-hover:bg-white/20 group-hover:text-white'}`}
                >
                  {OPTION_LETTERS[i]}
                </span>
                {option}
              </button>
            )
          })}
        </div>

        {locked && (
          <p className="animate-pop mt-6 text-center text-muted">
            Answer locked in. Waiting for everyone else
          </p>
        )}
      </div>
    </main>
  )
}
