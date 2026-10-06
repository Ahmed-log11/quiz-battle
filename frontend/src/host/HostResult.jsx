import Leaderboard from '../components/Leaderboard.jsx'
import { OPTION_LETTERS } from '../components/options.js'
import CodeBlock from '../components/CodeBlock.jsx'

/**
 * Host result screen (projector), shown after each question:
 * the correct answer, the fastest correct player, and the overall top 5.
 *
 * Props:
 *   question       { index, total, text, options }
 *   correctOption  index of the right option (0-3)
 *   fastest        { name, seconds } of the fastest correct player, or null
 *   correctCount   how many players got it right
 *   players        total number of players
 *   leaderboard    top players { name, score }, sorted highest first
 *   isLast         true after the final question
 *   onNext         called for the next question (or the final results)
 */
export default function HostResult({
  question,
  correctOption,
  fastest,
  correctCount,
  players,
  leaderboard,
  isLast,
  onNext,
}) {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-lg text-muted">
          Question {question.index + 1} of {question.total}
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold">{question.text}</h1>
        {question.code && (
          <div className="mt-4">
            <CodeBlock code={question.code} />
          </div>
        )}

        {/* Options with the correct one marked */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            const isCorrect = i === correctOption
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl p-4 text-lg font-semibold
                            ${isCorrect
                              ? 'animate-pop bg-correct text-white'
                              : 'bg-option/25 text-white/50'}`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm
                              ${isCorrect ? 'bg-white/25' : 'bg-white/10'}`}
                >
                  {OPTION_LETTERS[i]}
                </span>
                {option}
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[2fr_3fr]">
          {/* Fastest correct player */}
          <section>
            {fastest ? (
              <div className="animate-pop rounded-2xl border-2 border-gold bg-surface p-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                  Fastest correct
                </p>
                <p className="mt-3 text-5xl font-bold">{fastest.name}</p>
                <p className="mt-2 text-xl text-muted">{fastest.seconds.toFixed(1)}s</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-surface p-6 text-center">
                <p className="text-2xl font-bold">Nobody got this one</p>
              </div>
            )}
            <p className="mt-4 text-center text-lg text-muted">
              <span className="font-bold text-white">{correctCount}</span> of {players} answered
              correctly
            </p>
          </section>

          {/* Overall leaderboard */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-muted">Leaderboard</h2>
            <Leaderboard players={leaderboard.slice(0, 5)} highlight={fastest?.name} />
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="min-h-12 rounded-xl bg-accent px-8 py-3 text-lg font-bold
                       hover:brightness-110 active:scale-[0.98] transition"
          >
            {isLast ? 'Show final results' : 'Next question'}
          </button>
        </div>
      </div>
    </main>
  )
}
