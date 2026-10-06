import { useState } from 'react'
import Timer from '../components/Timer.jsx'
import { OPTION_LETTERS } from '../components/options.js'
import CodeBlock from '../components/CodeBlock.jsx'

/**
 * Typed-answer box: the player types what the code prints and submits it.
 * Phone keyboards would capitalize the first letter or "fix" the text,
 * so those features are turned off (Python output is case-sensitive).
 */
function TextAnswer({ locked, submitted, onSubmit }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (locked) return
    if (!text.trim()) {
      setError('Type an answer first')
      return
    }
    onSubmit(text.trim())
  }

  if (locked) {
    return (
      <div className="rounded-xl border-2 border-gold bg-accent p-4">
        <p className="text-sm text-white/70">Your answer</p>
        <p className="mt-1 whitespace-pre-wrap break-words font-mono text-xl font-semibold">{submitted}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="typed-answer" className="block text-sm text-muted">
        Type the output exactly as Python prints it
      </label>
      <input
        id="typed-answer"
        value={text}
        onChange={(e) => {
          setText(e.target.value.slice(0, 100))
          if (error) setError('')
        }}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-invalid={Boolean(error)}
        className={`mt-1 w-full rounded-xl border-2 bg-option p-4 font-mono text-xl text-option-text outline-none transition
                    ${error ? 'border-wrong' : 'border-transparent focus:border-accent'}`}
      />
      {error && <p className="mt-1 text-sm text-wrong">{error}</p>}
      <button
        type="submit"
        className="mt-3 w-full min-h-12 rounded-xl bg-accent p-3 font-bold
                   hover:brightness-110 active:scale-[0.98] transition"
      >
        Submit answer
      </button>
    </form>
  )
}

/**
 * Player question screen: four answer buttons and the countdown,
 * or a text box for typed-answer questions (question.type === 'text').
 * One answer per question: after tapping, the choice is locked in.
 *
 * Give this component key={question.index} in the parent so the
 * selection resets automatically for each new question.
 *
 * Props:
 *   question   { index, total, text, options, timeLimit, deadline }
 *   onAnswer   called with the chosen option index (0-3), or the typed text
 *   initialChoice  answer already sent for this question (e.g. after a refresh), or null
 */
export default function Question({ question, onAnswer, initialChoice = null }) {
  const [selected, setSelected] = useState(initialChoice)
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
        {question.code && (
          <div className="mt-4">
            <CodeBlock code={question.code} />
          </div>
        )}

        <div className="mt-4">
          <Timer deadline={question.deadline} timeLimit={question.timeLimit} />
        </div>

        {question.type === 'text' ? (
          <div className="mt-6">
            <TextAnswer locked={locked} submitted={selected} onSubmit={choose} />
          </div>
        ) : (
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
        )}

        {locked && (
          <p className="animate-pop mt-6 text-center text-muted">
            Answer locked in. Waiting for everyone else
          </p>
        )}
      </div>
    </main>
  )
}