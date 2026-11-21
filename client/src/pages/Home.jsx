
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Users,
} from 'lucide-react'

const features = [
  {
    number: '01',
    icon: MapPin,
    title: 'Spot an issue',
    description:
      'Discover civic problems in your neighbourhood and see what needs attention.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Raise your voice',
    description:
      'Submit a complaint with its details and location so it can be tracked.',
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: 'Track the change',
    description:
      'Follow the status of your report and stay informed about its progress.',
  },
]

function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero section */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Your city. Your voice. Your impact.
          </div>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-[#24251f] sm:text-6xl lg:text-7xl">
            Small reports.
            <br />
            <span className="font-serif font-medium italic text-[#ed6a32]">
              Big changes.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
            Broken roads, overflowing bins, water leaks — your neighbourhood
            deserves better. Report civic issues, track their progress, and
            help build a city that works for everyone.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-full bg-[#ed6a32] px-6 py-4 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              Report an Issue <ArrowRight size={18} />
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-4 font-semibold text-[#24251f] transition hover:border-stone-500"
            >
              Explore Issues <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-500">
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-green-700" />
              Community-powered
            </span>
            <span className="flex items-center gap-2">
              <Users size={17} className="text-green-700" />
              Built for citizens
            </span>
          </div>
        </div>

        {/* Visual illustration */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-5 -top-6 h-32 w-32 rounded-full bg-orange-200/50 blur-2xl" />
          <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full bg-green-200/50 blur-2xl" />

          <div className="relative rounded-[2rem] border border-white bg-[#e9e8dc] p-4 shadow-2xl shadow-stone-900/10 sm:p-6">
            <div className="flex items-center justify-between gap-3 px-2 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Community dashboard
                </p>
                <h2 className="mt-1 text-xl font-bold text-stone-900">
                  Your neighbourhood
                </h2>
              </div>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-green-800">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
                Live overview
              </span>
            </div>

            <div className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border border-[#d5d4c6] bg-[#dfe5d5] p-5">
              <svg
                viewBox="0 0 400 260"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <rect width="400" height="260" fill="#e3e8d9" />
                <path
                  d="M-20 65 L100 115 L180 35 L270 80 L420 20"
                  stroke="#ffffff"
                  strokeWidth="22"
                  fill="none"
                />
                <path
                  d="M40 290 L105 190 L175 150 L240 190 L420 110"
                  stroke="#ffffff"
                  strokeWidth="24"
                  fill="none"
                />
                <path
                  d="M140 -20 L175 70 L155 145 L215 280"
                  stroke="#ffffff"
                  strokeWidth="17"
                  fill="none"
                />
                <path
                  d="M-20 225 L90 205 L170 225 L300 190 L420 220"
                  stroke="#ffffff"
                  strokeWidth="12"
                  fill="none"
                />
                <path
                  d="M20 15 L80 45 L95 95 M300 0 L290 55 L330 90"
                  stroke="#c6d5b8"
                  strokeWidth="30"
                  fill="none"
                />
              </svg>

              <div className="relative flex justify-end">
                <span className="rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-stone-700 shadow-sm">
                  <MapPin size={13} className="mr-1 inline text-orange-600" />
                  Community map
                </span>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute -translate-x-20 -translate-y-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#ed6a32] text-white shadow-lg">
                    <MapPin size={18} />
                  </div>
                </div>
                <div className="absolute translate-x-14 -translate-y-14">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#d6a43b] text-white shadow-lg">
                    <MapPin size={18} />
                  </div>
                </div>
                <div className="absolute translate-x-20 translate-y-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#477d59] text-white shadow-lg">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <div className="h-20 w-20 rounded-full border border-white/80 bg-white/30" />
              </div>

              <div className="relative mt-4 flex justify-between text-xs font-medium text-stone-500">
                <span>Local issues</span>
                <span>Community action</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4">
                <div className="flex items-center gap-2 text-stone-500">
                  <Clock3 size={16} />
                  <span className="text-xs font-medium">In progress</span>
                </div>
                <p className="mt-3 text-2xl font-bold text-stone-900">Track</p>
                <p className="mt-1 text-xs text-stone-500">
                  Follow your reports
                </p>
              </div>

              <div className="rounded-2xl bg-[#24251f] p-4 text-white">
                <div className="flex items-center gap-2 text-white/70">
                  <TrendingUp size={16} />
                  <span className="text-xs font-medium">Get involved</span>
                </div>
                <p className="mt-3 text-2xl font-bold">Act</p>
                <p className="mt-1 text-xs text-white/70">
                  Make your voice count
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -left-3 top-1/3 hidden -translate-x-1/4 rounded-2xl bg-white px-4 py-3 shadow-xl sm:block">
            <p className="text-xs text-stone-500">Every voice matters</p>
            <p className="mt-1 font-bold text-stone-900">
              Change starts here ↗
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-stone-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6a32]">
                Simple by design
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                From problem to progress.
              </h2>
            </div>
            <p className="max-w-md leading-7 text-stone-600">
              A simple way for citizens to raise concerns and follow the
              journey toward a better neighbourhood.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.number}
                  className="group rounded-3xl border border-stone-200 bg-[#faf9f5] p-7 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-stone-900/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#ed6a32]">
                      <Icon size={23} />
                    </div>
                    <span className="text-sm font-bold text-stone-400">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-stone-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-stone-600">
                    {feature.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-7 rounded-[2rem] bg-[#24251f] p-8 text-white sm:p-12 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
              Your city needs you
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              See something that needs fixing?
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-stone-300">
              Turn your concern into a report. A better neighbourhood begins
              with people who care.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ed6a32] px-6 py-4 font-semibold text-white transition hover:bg-orange-500"
          >
            Make a report <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-200 px-5 py-7">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-stone-500 sm:flex-row">
          <p>
            <span className="font-bold text-stone-800">CivicPulse</span>
            {' '}— Your voice, your community.
          </p>
          <p>Built for better neighbourhoods.</p>
        </div>
      </footer>
    </main>
  )
}

export default Home
