import { Link, Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <div>
      <header>
        <nav aria-label="Main navigation">
          <Link to="/">Inicio</Link>
          <Link to="/quiz">Cuestionario</Link>
          <Link to="/results">Resultados</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
