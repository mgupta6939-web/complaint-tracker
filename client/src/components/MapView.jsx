import { Fragment, useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { Search, LocateFixed } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const INDIA_BOUNDS = [[6.5, 68.0], [35.8, 97.5]]

const COLORS = {
  pending: '#ea580c',
  'in-progress': '#2563eb',
  resolved: '#16a34a',
}

const LABELS = {
  pending: 'Reported',
  'in-progress': 'In progress',
  resolved: 'Resolved',
}

// Looks up any place in India using OpenStreetMap's free geocoder
async function searchPlace(query) {
  const url =
    'https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=in&limit=1&q=' +
    encodeURIComponent(query)

  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Search failed')

  const data = await res.json()
  if (!data.length) return null

  // boundingbox order is [south, north, west, east]
  const [south, north, west, east] = data[0].boundingbox.map(Number)
  return { bounds: [[south, west], [north, east]] }
}

// Moves the map whenever `view` changes
function FlyTo({ view }) {
  const map = useMap()

  useEffect(() => {
    if (!view) return

    if (view.bounds) {
      map.flyToBounds(view.bounds, { duration: 1, maxZoom: 15, padding: [20, 20] })
    } else {
      map.flyTo(view.center, view.zoom, { duration: 1 })
    }
  }, [view, map])

  return null
}

function MapView({ complaints = [], height = '520px' }) {
  const [view, setView] = useState(null)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')

  // Only keep complaints that have valid coordinates
  const pins = complaints.filter((c) => c.location?.coordinates?.length === 2)

  async function handleSearch(event) {
    event.preventDefault()
    const text = query.trim()
    if (!text) return

    setSearching(true)
    setSearchMessage('')

    try {
      const place = await searchPlace(text)

      if (place) {
        setView({ bounds: place.bounds })
      } else {
        setSearchMessage('No place found in India. Try a city, area or pincode.')
      }
    } catch {
      setSearchMessage('Search is unavailable right now. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  function handleLocate() {
    setSearchMessage('')

    if (!navigator.geolocation) {
      setSearchMessage('Your browser does not support location.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setView({ center: [pos.coords.latitude, pos.coords.longitude], zoom: 14 }),
      () => setSearchMessage('Location permission was denied.'),
      { timeout: 10000 }
    )
  }

  return (
    <div>
      {/* Search + controls */}
      <form onSubmit={handleSearch} className="mb-3 flex flex-wrap gap-2">
        <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-full border border-stone-200 bg-white px-4">
          <Search size={17} className="shrink-0 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any city, area or pincode in India…"
            aria-label="Search a place in India"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={searching}
          className="rounded-full bg-[#24251f] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {searching ? 'Searching…' : 'Search'}
        </button>

        <button
          type="button"
          onClick={handleLocate}
          className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          <LocateFixed size={16} /> Use my location
        </button>

        <button
          type="button"
          onClick={() => setView({ bounds: INDIA_BOUNDS })}
          className="rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          All India
        </button>
      </form>

      {searchMessage && <p className="mb-3 text-sm text-red-600">{searchMessage}</p>}

      <MapContainer
        bounds={INDIA_BOUNDS}
        minZoom={4}
        maxBounds={[[0, 60], [40, 105]]}
        maxBoundsViscosity={0.8}
        scrollWheelZoom
        style={{ height, width: '100%' }}
        className="rounded-3xl border border-stone-200"
      >
        <TileLayer
         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
         maxZoom={19}
         className="map-tiles"
        />

        <FlyTo view={view} />

        {pins.map((c) => {
          // MongoDB stores [longitude, latitude]; Leaflet wants [latitude, longitude]
          const [lng, lat] = c.location.coordinates
          const votes = c.upvotes?.length || 0
          const color = COLORS[c.status] || COLORS.pending

          return (
            <Fragment key={c._id}>
              {c.status !== 'resolved' && votes > 0 && (
                <CircleMarker
                  center={[lat, lng]}
                  radius={12 + Math.min(votes, 40)}
                  pathOptions={{ color, weight: 1, fillColor: color, fillOpacity: 0.15 }}
                />
              )}

              <CircleMarker
                center={[lat, lng]}
                radius={8}
                pathOptions={{ color: '#ffffff', weight: 3, fillColor: color, fillOpacity: 1 }}
              >
                <Popup>
                  <b>{c.title}</b>
                  <br />
                  {c.category} · {LABELS[c.status] || c.status}
                  <br />
                  {c.location?.address}
                  <br />
                  ▲ {votes} upvotes
                </Popup>
              </CircleMarker>
            </Fragment>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default MapView