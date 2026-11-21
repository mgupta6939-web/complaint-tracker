
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileText,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  CircleAlert,
} from 'lucide-react';

const filters = [
  'All Reports',
  'pending',
  'in-progress',
  'resolved',
];

function statusClass(status) {
  if (status === 'Resolved') {
    return 'bg-green-100 text-green-800';
  }

  if (status === 'In Progress') {
    return 'bg-blue-100 text-blue-800';
  }

  return 'bg-orange-100 text-orange-800';
}

function StatusIcon({ status }) {
  if (status === 'Resolved') {
    return <CheckCircle2 size={17} />;
  }

  if (status === 'In Progress') {
    return <Clock3 size={17} />;
  }

  return <CircleAlert size={17} />;
}

function MyReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Reports');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isActive = true;

    async function fetchReports() {
      try {
        setIsLoading(true);
        setLoadError('');

        const response = await api.get('/complaints?mine=true');

        if (isActive) {
          setReports(response.data.complaints || []);
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error.response?.data?.message ||
              'Unable to load your reports. Please log in and try again.'
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchReports();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reports.filter((report) => {
      const title = String(report.title || report.subject || '');
      const id = String(report.id || report._id || '');
      const location = String(report.location?.address || report.address || '')
      const status = report.status || 'Reported';

      const matchesFilter =
        activeFilter === 'All Reports' || status === activeFilter;

      const matchesSearch =
        title.toLowerCase().includes(term) ||
        id.toLowerCase().includes(term) ||
        location.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [reports, activeFilter, search]);

  const reportedCount = reports.filter((r) => r.status === 'pending').length
const progressCount = reports.filter((r) => r.status === 'in-progress').length
const resolvedCount = reports.filter((r) => r.status === 'resolved').length

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      {/* Heading */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6a32]">
          Your activity
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#24251f] sm:text-5xl">
              My reports.
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Keep track of the issues you have raised and follow their
              progress towards resolution.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#ed6a32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700 sm:self-auto"
          >
            <Plus size={18} />
            New report
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-3 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">Awaiting action</span>
            <CircleAlert size={20} className="text-orange-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-stone-900">
            {reportedCount}
          </p>

          <p className="mt-1 text-xs text-stone-500">Reported</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">Being addressed</span>
            <Clock3 size={20} className="text-blue-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-stone-900">
            {progressCount}
          </p>

          <p className="mt-1 text-xs text-stone-500">In progress</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">Completed</span>
            <CheckCircle2 size={20} className="text-green-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-stone-900">
            {resolvedCount}
          </p>

          <p className="mt-1 text-xs text-stone-500">Resolved</p>
        </div>
      </section>

      {/* Report list */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList size={22} className="text-[#ed6a32]" />

                <h2 className="text-xl font-bold text-stone-900">
                  Your submitted reports
                </h2>
              </div>

              <p className="mt-2 text-sm text-stone-500">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 sm:w-72">
              <Search size={18} className="shrink-0 text-stone-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reports..."
                aria-label="Search your reports"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Status filters */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-[#24251f] text-white'
                    : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {isLoading && (
            <p className="py-8 text-center text-gray-500">
              Loading your reports...
            </p>
          )}

          {/* Error state */}
          {!isLoading && loadError && (
            <div className="py-8 text-center">
              <p className="text-red-600">{loadError}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-[#24251f] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty account state */}
          {!isLoading && !loadError && reports.length === 0 && (
            <div className="py-14 text-center">
              <ClipboardList
                size={32}
                className="mx-auto text-stone-400"
              />

              <h3 className="mt-4 font-bold text-stone-900">
                No reports submitted yet
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Your submitted complaints will appear here.
              </p>

              <Link
                to="/report"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ed6a32] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
              >
                <Plus size={17} />
                Submit your first report
              </Link>
            </div>
          )}

          {/* Reports and search results */}
          {!isLoading && !loadError && reports.length > 0 && (
            <>
              {filteredReports.length > 0 && (
                <div className="mt-5 space-y-4">
                  {filteredReports.map((report) => {
                    const reportId = report.id || report._id;
                    const title = report.title || report.subject || 'Untitled report';
                    const location =
  report.location?.address || report.address || 'Location not provided'
                    
                    const description =
                      report.description || 'No description provided.';
                    
  const statusLabels = {
    pending: 'Reported',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
  };

  const status = statusLabels[report.status] || report.status || 'Reported';

    const dateValue = report.createdAt || report.date
  const date = dateValue
    ? new Date(dateValue).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Date unavailable'

  return (
                      <article
                        key={reportId}
                        className="rounded-2xl border border-stone-200 p-5 transition hover:border-orange-200"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                                {reportId}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(status)}`}
                              >
                                <StatusIcon status={status} />
                                {status}
                              </span>
                            </div>

                            <h3 className="mt-4 text-lg font-bold text-stone-900">
                              {title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-stone-600">
                              {description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {location}
                              </span>
<span className="flex items-center gap-1.5">
  <CalendarDays size={14} />
  {date}
</span>

                              <span className="flex items-center gap-1.5">
                                <FileText size={14} />
                                {report.category || 'Uncategorized'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start rounded-xl bg-stone-50 px-3 py-2 text-sm font-medium text-stone-600">
                            <StatusIcon status={status} />
                            <span>{status}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* No search/filter matches */}
              {filteredReports.length === 0 && (
                <div className="py-14 text-center">
                  <Search
                    size={28}
                    className="mx-auto text-stone-400"
                  />

                  <h3 className="mt-4 font-bold text-stone-900">
                    No reports found
                  </h3>

                  <p className="mt-2 text-sm text-stone-500">
                    Try another search or choose a different status filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setActiveFilter('All Reports');
                    }}
                    className="mt-4 text-sm font-semibold text-orange-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create another report */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-[#24251f] p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-bold">
              Something else needs attention?
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-300">
              Raise another report to help improve your neighbourhood.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ed6a32] px-5 py-3 font-semibold text-white hover:bg-orange-500"
          >
            Report an issue <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default MyReports;
