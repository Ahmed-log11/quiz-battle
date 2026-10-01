import { QRCodeSVG } from 'qrcode.react'

/**
 * Host lobby: shown on the projector while students join.
 *
 * Props (HostFlow owns the WebSocket, this screen only displays):
 *   code      room code, e.g. "KQZT"
 *   players   array of { name, connected } in join order
 *   onStart   called when the host clicks "Start game"
 */
export default function HostLobby({ code, players = [], onStart }) {
  const joinUrl = `${location.origin}/#/play?code=${code}`
  const siteName = location.host
  const count = players.length

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Room code + QR */}
        <section className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="text-center md:text-left">
            <p className="text-lg text-muted">
              Join at <span className="font-semibold text-white">{siteName}</span> with code
            </p>
            <p
              className="mt-1 text-7xl md:text-8xl font-bold tracking-[0.18em] text-gold"
              aria-label={`Room code ${code.split('').join(' ')}`}
            >
              {code}
            </p>
            <p className="mt-2 text-muted">or scan the QR code</p>
          </div>

          <div className="mx-auto rounded-2xl bg-option p-4">
            <QRCodeSVG
              value={joinUrl}
              size={200}
              bgColor="#F4F3FF"
              fgColor="#1B1740"
              title={`QR code to join room ${code}`}
            />
          </div>
        </section>

        {/* Count + start */}
        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-track pt-6">
          <p className="text-2xl font-bold" aria-live="polite">
            {count}{' '}
            <span className="text-base font-normal text-muted">
              {count === 1 ? 'player joined' : 'players joined'}
            </span>
          </p>

          <div className="flex items-center gap-4">
            {count === 0 && (
              <p className="text-sm text-muted">Wait for students to join</p>
            )}
            <button
              type="button"
              onClick={onStart}
              className="min-h-12 rounded-xl bg-accent px-8 py-3 text-lg font-bold
                         hover:brightness-110 active:scale-[0.98] transition"
            >
              Start game
            </button>
          </div>
        </section>

        {/* Name chips: each new chip plays the join animation once when it appears */}
        <section className="mt-6 flex flex-wrap gap-2">
          {players.map((player) => (
            <span
              key={player.name}
              className={`animate-join rounded-full bg-surface px-4 py-2 font-semibold
                          ${player.connected === false ? 'opacity-40' : ''}`}
              title={player.connected === false ? 'Disconnected' : undefined}
            >
              {player.name}
            </span>
          ))}
        </section>
      </div>
    </main>
  )
}
