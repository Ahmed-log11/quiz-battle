import { useState } from 'react'

// Reads ?code=KQZT from the link, so students who scan the QR code
// only need to type their name. Works for "#/play?code=KQZT" and "?code=KQZT".
function codeFromUrl() {
  const hashQuery = location.hash.split('?')[1] ?? ''
  const params = new URLSearchParams(hashQuery || location.search)
  return (params.get('code') ?? '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)
}

/**
 * Welcome screen: students join a room, the instructor goes to host.
 *
 * Props (the parent owns the WebSocket, this screen only collects input):
 *   onJoin({ code, name })  called with a valid code and name
 *   onHost()                called when "Host a game" is clicked
 *   serverError             message from the server, e.g. "Room not found"
 *   joining                 true while waiting for the server to reply
 */
export default function Welcome({ onJoin, onHost, serverError = '', joining = false }) {
  const [code, setCode] = useState(codeFromUrl) // prefilled from the QR link
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({ code: '', name: '' })

  function handleCodeChange(e) {
    // Letters only, uppercase, max 4
    const cleaned = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)
    setCode(cleaned)
    if (errors.code) setErrors((prev) => ({ ...prev, code: '' }))
  }

  function handleNameChange(e) {
    setName(e.target.value.slice(0, 20))
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (joining) return

    const trimmedName = name.trim()
    const newErrors = {
      code: code.length === 4 ? '' : 'Enter the 4-letter code from the screen',
      name: trimmedName ? '' : 'Enter your name',
    }
    setErrors(newErrors)
    if (newErrors.code || newErrors.name) return

    onJoin?.({ code, name: trimmedName })
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold">
          Quiz <span className="text-gold">Battle</span>
        </h1>
        <p className="mt-2 text-muted">Live class quiz. Fastest right answer wins.</p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 rounded-2xl bg-surface p-5 text-left"
        >
          <label htmlFor="room-code" className="block text-sm text-muted">
            Room code
          </label>
          <input
            id="room-code"
            value={code}
            onChange={handleCodeChange}
            placeholder="KQZT"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            aria-invalid={Boolean(errors.code)}
            className={`mt-1 w-full rounded-xl bg-option text-option-text p-3 text-center
                        text-xl font-semibold uppercase tracking-[0.35em] outline-none
                        placeholder:text-option-text/30 border-2 transition
                        ${errors.code ? 'border-wrong' : 'border-transparent focus:border-accent'}`}
          />
          {errors.code && <p className="mt-1 text-sm text-wrong">{errors.code}</p>}

          <label htmlFor="player-name" className="mt-4 block text-sm text-muted">
            Your name
          </label>
          <input
            id="player-name"
            value={name}
            onChange={handleNameChange}
            placeholder="Sara"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            className={`mt-1 w-full rounded-xl bg-option text-option-text p-3 outline-none
                        placeholder:text-option-text/40 border-2 transition
                        ${errors.name ? 'border-wrong' : 'border-transparent focus:border-accent'}`}
          />
          {errors.name && <p className="mt-1 text-sm text-wrong">{errors.name}</p>}

          {serverError && (
            <p role="alert" className="mt-4 rounded-lg bg-wrong/15 px-3 py-2 text-sm text-wrong">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full min-h-12 rounded-xl bg-accent p-3 font-bold
                       hover:brightness-110 active:scale-[0.98] transition"
          >
            {joining ? 'Joining…' : 'Join game'}
          </button>
        </form>

        <button
          type="button"
          onClick={onHost}
          className="mt-4 text-sm text-muted hover:text-white transition"
        >
          Running the class? <span className="font-semibold text-gold">Host a game</span>
        </button>
      </div>
    </main>
  )
}
