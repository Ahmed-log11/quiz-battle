import { useEffect, useState } from 'react'

/**
 * Countdown bar that counts down to the server's deadline, so every screen
 * shows the same time left no matter when the question arrived.
 *
 * Props:
 *   deadline    end time in milliseconds since epoch (from the server)
 *   timeLimit   total seconds for the question (sets the bar's full width)
 *   size        'lg' for the projector, 'sm' for phones
 */
export default function Timer({ deadline, timeLimit, size = 'sm' }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [])

  const msLeft = Math.max(0, deadline - now)
  const secondsLeft = Math.ceil(msLeft / 1000)
  const fraction = Math.min(1, msLeft / (timeLimit * 1000))
  const urgent = secondsLeft <= 5

  return (
    <div className="flex items-center gap-3" role="timer" aria-label={`${secondsLeft} seconds left`}>
      <div className={`flex-1 overflow-hidden rounded-full bg-track ${size === 'lg' ? 'h-3' : 'h-2'}`}>
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear
                      ${urgent ? 'bg-wrong' : 'bg-gold'}`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
      <span
        className={`min-w-[2ch] text-right font-bold
                    ${size === 'lg' ? 'text-3xl' : 'text-lg'}
                    ${urgent ? 'text-wrong' : 'text-white'}`}
      >
        {secondsLeft}
      </span>
    </div>
  )
}
