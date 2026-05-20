/* Marquee ticker bar – rendered just above the Footer */

const ITEMS = [
  'make the good fight good fun',
  'method for change',
  'make the good fight good fun',
  'method for change',
  'make the good fight good fun',
  'method for change',
  'make the good fight good fun',
  'method for change',
]

function MarqueeBar() {
  /* Duplicate the list so the second track creates the seamless loop */
  return (
    <div className="marquee-bar" aria-hidden="true">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((text, i) => (
          <span key={i} className="marquee-item">
            {text}
            <span className="marquee-sep" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
      {/* second clone for seamless infinite loop */}
      <div className="marquee-track" aria-hidden="true">
        {[...ITEMS, ...ITEMS].map((text, i) => (
          <span key={i} className="marquee-item">
            {text}
            <span className="marquee-sep" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default MarqueeBar
