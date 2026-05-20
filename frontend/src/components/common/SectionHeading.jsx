function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">PROPIC web</p>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}

export default SectionHeading