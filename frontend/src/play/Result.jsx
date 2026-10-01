/**
 * Player result screen: right or wrong, points earned, current rank.
 *
 * Props:
 *   result {
 *     answered       did the player answer in time
 *     correct        was the answer right
 *     points         points earned this question
 *     score          total score so far
 *     rank           current position (1 = first)
 *     totalPlayers   number of players in the game
 *     streak         correct answers in a row
 *     correctAnswer  text of the right option
 *     fastestName    name of the fastest correct player, or null
 *   }
 *   name   this player's name (to celebrate being the fastest)
 */
export default function Result({ result, name }) {
  const { answered, correct, points, score, rank, totalPlayers, streak, correctAnswer, fastestName } = result
  const wasFastest = correct && fastestName === name

  const headline = wasFastest ? 'Fastest!' : correct ? 'Correct' : answered ? 'Not quite' : "Time's up"
  const color = correct ? 'text-correct' : 'text-wrong'

  return (
    <main className="min-h-screen grid place-items-center p-4 text-center">
      <div className="w-full max-w-sm">
        <div className="animate-pop">
          <p className={`text-5xl font-bold ${wasFastest ? 'text-gold' : color}`}>{headline}</p>
          <p className="mt-3 text-3xl font-bold">+{points}</p>
        </div>

        {!correct && (
          <p className="mt-4 text-muted">
            The answer was <span className="font-semibold text-white">{correctAnswer}</span>
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface p-4">
            <p className="text-sm text-muted">Rank</p>
            <p className="text-2xl font-bold">
              {rank}
              <span className="text-base font-normal text-muted"> / {totalPlayers}</span>
            </p>
          </div>
          <div className="rounded-xl bg-surface p-4">
            <p className="text-sm text-muted">Score</p>
            <p className="text-2xl font-bold">{score.toLocaleString()}</p>
          </div>
        </div>

        {streak >= 2 && (
          <p className="animate-pop mt-4 font-semibold text-gold">{streak} in a row</p>
        )}

        {fastestName && !wasFastest && (
          <p className="mt-4 text-sm text-muted">
            Fastest this round: <span className="font-semibold text-white">{fastestName}</span>
          </p>
        )}
      </div>
    </main>
  )
}
