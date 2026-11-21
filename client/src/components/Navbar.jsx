import { logoutUser } from '../services/authService.js'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Menu, X, ArrowUpRight, LogOut } from 'lucide-react'
import { useState } from 'react'

const publicItems = [
  { name: 'Home', path: '/' },
  { name: 'Explore Issues', path: '/explore' },
]

const privateItems = [
  { name: 'Report an Issue', path: '/report' },
  { name: 'My Reports', path: '/my-reports' },
]

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('civicpulse_user'))
  } catch {
    return null
  }
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Re-render on every page change so the login state is always fresh
  useLocation()

  const isLoggedIn = Boolean(localStorage.getItem('civicpulse_token'))
  const user = getStoredUser()
  const firstName = user?.name ? user.name.split(' ')[0] : 'there'
  const navItems = isLoggedIn ? [...publicItems, ...privateItems] : publicItems

  function handleLogout() {
    logoutUser()
    setMenuOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-[#ed6a32]' : 'text-stone-600 hover:text-stone-950'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f7f2]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ed6a32] text-white">
            <Activity size={23} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Civic<span className="text-[#ed6a32]">Pulse</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-medium text-stone-600">Hi, {firstName}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-[#24251f] transition hover:border-stone-500"
              >
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-[#24251f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ed6a32]"
            >
              Get Started <ArrowUpRight size={16} />
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-black/10 p-2 md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-black/5 px-5 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-orange-100 text-orange-700' : 'text-stone-700 hover:bg-stone-100'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-xl bg-[#24251f] px-4 py-3 text-center font-semibold text-white"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl bg-[#24251f] px-4 py-3 text-center font-semibold text-white"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar