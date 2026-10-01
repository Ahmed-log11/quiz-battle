/**
 * Player lobby: shown on the student's phone after joining, until the host starts.
 *
 * Props:
 *   name   the player's name
 *   code   room code they joined
 */
export default function PlayerLobby({ name, code }) {
  return (
    <main className="min-h-screen grid place-items-center p-4 text-center">
      <div className="animate-pop">
        <p className="text-muted">Room {code}</p>
        <h1 className="mt-2 text-3xl font-bold">
          You're in, <span className="text-gold">{name}</span>
        </h1>
        <p className="mt-3 text-muted">Waiting for the host to start</p>

        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-accent animate-bounce" />
          <span className="size-3 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
          <span className="size-3 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </main>
  )
}
