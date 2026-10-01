import Leaderboard from '../components/Leaderboard.jsx'

// Order and heights for the podium: 2nd on the left, 1st in the middle, 3rd on the right
const PODIUM = [
  { place: 1, label: '2nd', height: 'h-32', delay: '300ms' },
  { place: 0, label: '1st', height: 'h-44', delay: '600ms' },
  { place: 2, label: '3rd', height: 'h-24', delay: '0ms' },
]

/**
 * Host final screen (projector): podium for the top 3, ranks 4-10,
 * fun awards, and a results download.
 *
 * Props:
 *   leaderboard  all players { name, score }, sorted highest first
 *   awards       array of { title, name, detail }, e.g.
 *                { title: 'Biggest streak', name: 'Sara', detail: '6 in a row' }
 *   csvUrl       link to download the results CSV (optional)
 *   onNewGame    called to go back and host another game (optional)
 */
export default function HostFinal({ leaderboard, awards = [], csvUrl, onNewGame }) {
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3, 10)

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-4xl md:text-5xl font-bold">
          Final <span className="text-gold">results</span>
        </h1>

        {/* Podium */}
        <section className="mt-10 flex items-end justify-center gap-4">
          {PODIUM.map(({ place, label, height, delay }) => {
            const player = top3[place]
            if (!player) return null
            const first = place === 0
            return (
              <div
                key={label}
                className="animate-rise flex w-36 md:w-48 flex-col items-center"
                style={{ animationDelay: delay }}
              >
                <p className={`truncate max-w-full font-bold ${first ? 'text-3xl text-gold' : 'text-2xl'}`}>
                  {player.name}
                </p>
                <p className="text-muted">{player.score.toLocaleString()}</p>
                <div
                  className={`mt-3 grid w-full place-items-center rounded-t-2xl ${height}
                              ${first ? 'bg-gold text-option-text' : 'bg-surface'}`}
                >
                  <span className="text-3xl font-bold">{label}</span>
                </div>
              </div>
            )
          })}
        </section>

        <div className="mt-10 grid gap-8 md:grid-cols-[3fr_2fr]">
          {/* Ranks 4-10 */}
          <section>
            {rest.length > 0 && (
              <>
                <h2 className="mb-3 text-lg font-semibold text-muted">Top 10</h2>
                <Leaderboard players={rest} startRank={4} />
              </>
            )}
          </section>

          {/* Awards */}
          <section>
            {awards.length > 0 && (
              <>
                <h2 className="mb-3 text-lg font-semibold text-muted">Awards</h2>
                <div className="space-y-3">
                  {awards.map((award, i) => (
                    <div
                      key={award.title}
                      className="animate-pop rounded-xl bg-surface p-4"
                      style={{ animationDelay: `${900 + i * 150}ms` }}
                    >
                      <p className="text-sm text-gold">{award.title}</p>
                      <p className="text-xl font-bold">{award.name}</p>
                      <p className="text-sm text-muted">{award.detail}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        <div className="mt-10 flex flex-wrap justify-end gap-3">
          {csvUrl && (
            <a
              href={csvUrl}
              download
              className="rounded-xl border border-track px-6 py-3 font-semibold text-muted
                         hover:border-accent hover:text-white transition"
            >
              Download results
            </a>
          )}
          {onNewGame && (
            <button
              type="button"
              onClick={onNewGame}
              className="rounded-xl bg-accent px-6 py-3 font-bold hover:brightness-110 transition"
            >
              New game
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
