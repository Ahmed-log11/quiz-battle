/**
 * Ranked list of players, used on the host result and final screens.
 *
 * Props:
 *   players     array of { name, score } already sorted, highest first
 *   startRank   rank of the first row (e.g. 4 when the podium shows 1-3)
 *   highlight   name to highlight (e.g. the fastest player this question)
 */
export default function Leaderboard({ players, startRank = 1, highlight }) {
  return (
    <ol className="space-y-2">
      {players.map((player, i) => {
        const rank = startRank + i
        const isHighlight = player.name === highlight
        return (
          <li
            key={player.name}
            className={`animate-rise flex items-center gap-4 rounded-xl px-4 py-3
                        ${isHighlight ? 'bg-accent' : 'bg-surface'}`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className={`w-8 text-lg font-bold ${rank === 1 ? 'text-gold' : 'text-muted'}`}>
              {rank}
            </span>
            <span className="flex-1 truncate text-lg font-semibold">{player.name}</span>
            <span className="text-lg font-bold">{player.score.toLocaleString()}</span>
          </li>
        )
      })}
    </ol>
  )
}
