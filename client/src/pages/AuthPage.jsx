
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  loginUser,
  registerUser,
} from '../services/authService';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  UserRound,
  ShieldCheck,
} from 'lucide-react'

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/explore'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isRegister = mode === 'register'

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setNotice('')
    setPassword('')
    setConfirmPassword('')
  }


async function handleSubmit(event) {
  event.preventDefault()
  setError('')
  setNotice('')

  if (isSubmitting) return

  if (isRegister && name.trim().length < 2) {
    setError('Please enter your name.')
    return
  }

  if (password.length < 8) {
    setError('Your password must contain at least 8 characters.')
    return
  }

  if (isRegister && password !== confirmPassword) {
    setError('Your passwords do not match.')
    return
  }

  setIsSubmitting(true)

  try {
    const credentials = {
      email: email.trim().toLowerCase(),
      password,
    }

    const user = isRegister
      ? await registerUser({
          ...credentials,
          name: name.trim(),
        })
      : await loginUser(credentials)

    localStorage.setItem('civicpulse_user', JSON.stringify(user))

    setNotice(
      isRegister
        ? 'Your account was created successfully!'
        : 'Login successful!'
    )

navigate(from, { replace: true })
  } catch (err) {
    setError(
      err.response?.data?.message ||
        'Unable to connect to CivicPulse. Please check that the backend is running and try again.'
    )
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-2 lg:px-8">
        {/* Left information panel */}
        <section className="hidden rounded-[2rem] bg-[#24251f] p-10 text-white lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between xl:p-14">
          <Link to="/" className="inline-flex items-center gap-3 self-start">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ed6a32]">
              <HeartHandshake size={24} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              CivicPulse
            </span>
          </Link>

          <div className="py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Better neighbourhoods start here
            </span>

            <h1 className="mt-8 max-w-lg text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
              Your city.
              <br />
              Your voice.
              <br />
              <span className="text-[#ed956d]">Your impact.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-stone-300">
              Report local problems, support your community, and help make
              civic services more accountable.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="text-[#ed956d]" size={23} />
              <p className="mt-4 font-semibold">Your account</p>
              <p className="mt-1 text-sm leading-6 text-stone-400">
                A place to manage your reports.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <HeartHandshake className="text-[#ed956d]" size={23} />
              <p className="mt-4 font-semibold">Community first</p>
              <p className="mt-1 text-sm leading-6 text-stone-400">
                Every useful report can help.
              </p>
            </div>
          </div>
        </section>

        {/* Authentication form */}
        <section className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-orange-700"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 lg:hidden">
              <HeartHandshake size={25} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#ed6a32]">
              Welcome to CivicPulse
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-900">
              {isRegister ? 'Create your account' : 'Welcome back.'}
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              {isRegister
                ? 'Join your community and start raising civic issues.'
                : 'Sign in to manage your reports and support local issues.'}
            </p>

            {/* Mode switch */}
            <div className="mt-7 grid grid-cols-2 rounded-xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  !isRegister
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isRegister
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {isRegister && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-stone-800"
                  >
                    Full name
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                    <UserRound size={18} className="text-stone-400" />
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-transparent py-3.5 text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                  <Mail size={18} className="text-stone-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent py-3.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                  <LockKeyhole size={18} className="text-stone-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent py-3.5 text-sm outline-none"
                  />

                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((current) => !current)}
                    className="shrink-0 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-stone-800"
                  >
                    Confirm password
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                    <LockKeyhole size={18} className="text-stone-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Enter your password again"
                      className="w-full bg-transparent py-3.5 text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                  {location.state?.from && !error && (
  <p className="rounded-xl bg-stone-100 p-3 text-sm text-stone-700">
    Please log in to continue.
  </p>
)}
                </p>
              )}

              {notice && (
                <p
                  role="status"
                  className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm leading-6 text-orange-900"
                >
                  {notice}
                </p>
              )}

              
<button
  type="submit"
  disabled={isSubmitting}
  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ed6a32] px-5 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting
    ? 'Please wait...'
    : isRegister
      ? 'Create account'
      : 'Login'}

  {!isSubmitting && <ArrowRight size={18} />}
</button>

            </form>

          </div>

          <p className="mt-5 text-center text-sm text-stone-500">
            Want to explore first?{' '}
            <Link
              to="/explore"
              className="font-semibold text-orange-700 hover:text-orange-800"
            >
              Browse civic issues
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default AuthPage
