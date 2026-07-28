import { NavLink, Outlet } from 'react-router-dom'

export function MainLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link'

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <span className="app-brand">Cloud Exam Trainer</span>
          <nav aria-label="Navegación principal">
            <NavLink to="/" end className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/quiz" className={linkClass}>
              Cuestionarios
            </NavLink>
            <NavLink to="/results" className={linkClass}>
              Resultados
            </NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
