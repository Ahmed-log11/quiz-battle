/**
 * Code snippet for "what does this code print?" questions.
 * Keeps spaces and line breaks exactly as written, so indentation shows.
 *
 * Props:
 *   code   the snippet text (with \n line breaks)
 *   size   'lg' for the projector, 'sm' for phones
 */
export default function CodeBlock({ code, size = 'sm' }) {
  if (!code) return null
  const lines = code.split('\n')

  return (
    <pre
      className={`overflow-x-auto rounded-xl border border-track bg-[#120F2E] font-mono leading-relaxed
                  ${size === 'lg' ? 'p-6 text-2xl md:text-3xl' : 'p-4 text-sm md:text-base'}`}
    >
      <code>
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-4 w-6 shrink-0 select-none text-right text-muted/50">{i + 1}</span>
            <span className="whitespace-pre text-option">{line || ' '}</span>
          </div>
        ))}
      </code>
    </pre>
  )
}