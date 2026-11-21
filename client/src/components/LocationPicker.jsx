import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMap, useMapEvents } from 'react-leaflet'
import { LocateFixed } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const INDIA_BOUNDS = [[6.5, 68.0], [35.8, 97.5]]

// Turns coordinates into a readable address
async function reverseGeocode(lat, lng) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`

  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Address lookup failed')

  const data = await res.json()
  return {
    address: data.display_name || '',
    inIndia: data.address?.country_code === 'in',
  }
}

function ClickHandler({ onPick }) {
  useMapEvents({ click: (event) => onPick(event.latlng.lat, event.latlng.lng) })
  return null
}

function FlyToPoint({ point }) {
  const map = useMap()

  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 15), { duration: 1 })
  }, [point, map])

  return null
}

// value: { lat, lng } or null
// onChange: called with { lat, lng, address }
function LocationPicker({ value, onChange }) {
  const [status, setStatus] = useState('')

  async function pick(lat, lng) {
    setStatus('Finding the address…')

    try {
      const { address, inIndia } = await reverseGeocode(lat, lng)

      if (!inIndia) {
        setStatus('Please choose a location inside India.')
        return
      }

      onChange({ lat, lng, address: address.slice(0, 200) })
      setStatus('')
    } catch {
      // Keep the pin, let the person type the address themselves
      onChange({ lat, lng, address: '' })
      setStatus('Pin saved, but we could not find the address. Please type it below.')
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus('Your browser does not support location.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => pick(pos.coords.latitude, pos.coords.longitude),
      () => setStatus('Location permission was denied. Click the map instead.'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs text-stone-500">Click the map to drop a pin on the exact spot.</p>

        <button
          type="button"
          onClick={useMyLocation}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
        >
          <LocateFixed size={14} /> Use my location
        </button>
      </div>

      <MapContainer
        bounds={INDIA_BOUNDS}
        minZoom={4}
        maxBounds={[[0, 60], [40, 105]]}
        maxBoundsViscosity={0.8}
        style={{ height: '320px', width: '100%' }}
        className="rounded-2xl border border-stone-200"
      >
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
         className="map-tiles"
        />

        <ClickHandler onPick={pick} />
        <FlyToPoint point={value} />

        {value && (
          <CircleMarker
            center={[value.lat, value.lng]}
            radius={10}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#ed6a32', fillOpacity: 1 }}
          />
        )}
      </MapContainer>

      {status && <p className="mt-2 text-sm text-orange-800">{status}</p>}
    </div>
  )
}

export default LocationPicker