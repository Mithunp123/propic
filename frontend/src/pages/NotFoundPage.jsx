import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="card-panel">
      <h1>Page not found</h1>
      <Link className="button primary" to="/">Back home</Link>
    </section>
  )
}

export default NotFoundPage