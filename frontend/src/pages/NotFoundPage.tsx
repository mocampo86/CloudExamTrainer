import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section>
      <h1>Página no encontrada</h1>
      <p>La ruta solicitada no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
