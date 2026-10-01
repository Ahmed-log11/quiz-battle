/**
 * Player final screen: the student's final rank and stats.
 *
 * Props:
 *   final { rank, totalPlayers, score, correctCount, totalQuestions, bestStreak }
 *   name  this player's name
 */
export default function Final({ final, name }) {
  const { rank, totalPlayers, score, correctCount, totalQuestions, bestStreak } = final
  const podium = rank <= 3
  const medal = ['1st', '2nd', '3rd'][rank - 1]

  return (
    <main className="min-h-screen grid place-items-center p-4 text-center">
      <div className="w-full max-w-sm">
        <p className="text-muted">Game over, {name}</p>

        <div className="animate-pop mt-4">
          {podium ? (
            <p className="text-6xl font-bold text-gold">{medal}</p>
          ) : (
            <p className="text-6xl font-bold">#{rank}</p>
          )}
          <p className="mt-2 text-muted">out of {totalPlayers} players</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-surface p-3">
            <p className="text-xs text-muted">Score</p>
            <p className="text-xl font-bold">{score.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-surface p-3">
            <p className="text-xs text-muted">Correct</p>
            <p className="text-xl font-bold">
              {correctCount}/{totalQuestions}
            </p>
          </div>
          <div className="rounded-xl bg-surface p-3">
            <p className="text-xs text-muted">Best streak</p>
            <p className="text-xl font-bold">{bestStreak}</p>
          </div>
        </div>

        <p className="mt-8 text-muted">Check the big screen for the podium</p>
      </div>
    </main>
  )
}
