import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  ThumbsUp,
  Clock3,
  CheckCircle2,
  CircleAlert,
  Filter,
} from 'lucide-react'
import api from '../api/api.js'
import MapView from '../components/MapView.jsx'

// Backend values -> labels shown on screen
const CATEGORY_LABELS = {
  road: 'Roads',
  water: 'Water Supply',
  garbage: 'Sanitation',
  electricity: 'Electricity',
  other: 'Other',
}

const STATUS_LABELS = {
  pending: 'Reported',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
}

const categories = ['All Categories', ...Object.values(CATEGORY_LABELS)]
const statuses = ['All Statuses', 'Reported', 'In Progress', 'Resolved']

function statusStyle(label) {
  if (label === 'Resolved') return 'bg-green-100 text-green-800'
  if (label === 'In Progress') return 'bg-blue-100 text-blue-800'
  return 'bg-orange-100 text-orange-800'
}

function getStoredUserId() {
  try {
    return JSON.parse(localStorage.getItem('civicpulse_user'))?.id || null
  } catch {
    return null
  }
}

function Explore() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(localStorage.getItem('civicpulse_token'))
  const userId = getStoredUserId()

  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [status, setStatus] = useState('All Statuses')

  async function loadComplaints() {
    try {
      const res = await api.get('/complaints')
      setComplaints(res.data.complaints || [])
      setError('')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load issues. Please check that the server is running.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const filteredIssues = useMemo(() => {
    const term = search.trim().toLowerCase()

    return complaints.filter((c) => {
      const address = c.location?.address || ''

      const matchesSearch =
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        address.toLowerCase().includes(term)

      const matchesCategory =
        category === 'All Categories' || CATEGORY_LABELS[c.category] === category

      const matchesStatus =
        status === 'All Statuses' || STATUS_LABELS[c.status] === status

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [complaints, search, category, status])

  async function handleVote(complaint) {
    // Only logged-in users can support an issue
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/explore' } })
      return
    }

    try {
      const res = await api.put(`/complaints/${complaint._id}/upvote`)

      if (!userId) {
        await loadComplaints()
        return
      }

      setComplaints((list) =>
        list.map((c) => {
          if (c._id !== complaint._id) return c
          const others = c.upvotes.filter((id) => id !== userId)
          return { ...c, upvotes: res.data.upvoted ? [...others, userId] : others }
        })
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your support. Please try again.')
    }
  }

  const reportedCount = complaints.filter((c) => c.status === 'pending').length
  const progressCount = complaints.filter((c) => c.status === 'in-progress').length
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      {/* Page heading */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6a32]">
          Community issue tracker
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#24251f] sm:text-5xl">
              Explore your country.
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Discover reported civic issues anywhere in India, see their
              locations, and support problems that need attention.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-600 md:self-auto">
            <MapPin size={17} className="text-[#ed6a32]" />
            India · {complaints.length} live {complaints.length === 1 ? 'issue' : 'issues'}
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 sm:grid-cols-3 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">Reported</span>
            <CircleAlert size={20} className="text-orange-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-stone-900">{reportedCount}</p>
          <p className="mt-1 text-xs text-stone-500">Awaiting action</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">In progress</span>
            <Clock3 size={20} className="text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-stone-900">{progressCount}</p>
          <p className="mt-1 text-xs text-stone-500">Being addressed</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">Resolved</span>
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-stone-900">{resolvedCount}</p>
          <p className="mt-1 text-xs text-stone-500">Marked as resolved</p>
        </div>
      </section>

      {/* Interactive map */}
      <section className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-4 pt-2">
            <div>
              <h2 className="font-bold text-stone-900">Issues across India</h2>
              <p className="mt-1 text-sm text-stone-500">
                Search any place, then select a marker to view an issue.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-600" />
                Reported
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                In progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                Resolved
              </span>
            </div>
          </div>

          <MapView complaints={filteredIssues} height="420px" />
        </div>
      </section>

      {/* Search and filters */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-10 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ed6a32]">
              Community reports
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900">Find an issue</h2>
          </div>

          <p className="text-sm text-stone-500">
            Showing {filteredIssues.length} of {complaints.length} issues
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_200px]">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3.5">
            <Search size={19} className="shrink-0 text-stone-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search issues or locations..."
              aria-label="Search issues or locations"
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3">
            <Filter size={17} className="shrink-0 text-stone-400" />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
              className="w-full bg-transparent py-3.5 text-sm outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm outline-none"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {isLoading && <p className="mt-8 text-center text-stone-500">Loading issues…</p>}
        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        {/* Issue cards */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {filteredIssues.map((c) => {
            const statusLabel = STATUS_LABELS[c.status] || 'Reported'
            const supported = Boolean(userId) && c.upvotes.includes(userId)

            return (
              <article
                key={c._id}
                className="rounded-3xl border border-stone-200 bg-white p-6 transition hover:border-orange-200 hover:shadow-lg hover:shadow-stone-900/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <MapPin size={15} className="shrink-0" />
                    <span className="truncate">{c.location?.address || 'Pinned on map'}</span>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(statusLabel)}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt=""
                    className="mt-4 h-40 w-full rounded-2xl object-cover"
                  />
                )}

                <h3 className="mt-4 text-xl font-bold text-stone-900">{c.title}</h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
                  {c.description}
                </p>

                <p className="mt-3 text-xs text-stone-400">
                  Reported by {c.createdBy?.name || 'a neighbour'} ·{' '}
                  {new Date(c.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                  <span className="rounded-lg bg-stone-100 px-3 py-2 text-xs font-medium text-stone-600">
                    {CATEGORY_LABELS[c.category] || c.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVote(c)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      supported
                        ? 'border-orange-200 bg-orange-50 text-orange-700'
                        : 'border-stone-200 text-stone-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700'
                    }`}
                  >
                    <ThumbsUp size={16} />
                    {supported ? 'Supported' : 'Support issue'}
                    <span>· {c.upvotes.length}</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {!isLoading && !error && complaints.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-stone-900">No issues reported yet</h3>
            <p className="mt-2 text-sm text-stone-500">Be the first to report a problem in your area.</p>
          </div>
        )}

        {!isLoading && complaints.length > 0 && filteredIssues.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
            <Search size={28} className="mx-auto text-stone-400" />
            <h3 className="mt-4 text-lg font-bold text-stone-900">No matching issues found</h3>
            <p className="mt-2 text-sm text-stone-500">
              Try another search term or change your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('All Categories')
                setStatus('All Statuses')
              }}
              className="mt-4 font-semibold text-orange-700 hover:text-orange-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Explore