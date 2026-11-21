import LocationPicker from '../components/LocationPicker.jsx'
import api from '../api/api.js'
import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  FileText,
  MapPin,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'
import { Link,Navigate, useNavigate } from 'react-router-dom'

const categories = [
  'Roads & Potholes',
  'Water Supply',
  'Sanitation & Waste',
  'Streetlights & Electricity',
  'Drainage & Flooding',
  'Public Safety',
  'Other',
]

function Report() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  })

  const [photo, setPhoto] = useState(null)
  const [photoError, setPhotoError] = useState('')
  const [message, setMessage] = useState('')
  const [point, setPoint] = useState(null)
const [isSubmitting, setIsSubmitting] = useState(false)
const navigate = useNavigate()
   const token = localStorage.getItem('civicpulse_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setMessage('')
  }

  function handlePhotoChange(event) {
    const selectedFile = event.target.files?.[0]

    setPhotoError('')
    setMessage('')

    if (!selectedFile) {
      setPhoto(null)
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      setPhoto(null)
      setPhotoError('Please select an image file.')
      event.target.value = ''
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setPhoto(null)
      setPhotoError('The image must be 5 MB or smaller.')
      event.target.value = ''
      return
    }

    setPhoto(selectedFile)
  }
  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!localStorage.getItem('civicpulse_token')) {
      setMessage('Please log in before submitting a report.')
      return
    }

    if (!point) {
      setMessage('Please drop a pin on the map to show where the issue is.')
      return
    }

    const categoryMap = {
      'Roads & Potholes': 'road',
      'Water Supply': 'water',
      'Sanitation & Waste': 'garbage',
      'Streetlights & Electricity': 'electricity',
      'Drainage & Flooding': 'other',
      'Public Safety': 'other',
      Other: 'other',
    }

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('category', categoryMap[form.category] || 'other')
    formData.append('address', form.location)
    formData.append('latitude', point.lat)
    formData.append('longitude', point.lng)
    if (photo) formData.append('image', photo)

    try {
      setIsSubmitting(true)
      setMessage('Submitting your report...')

      const response = await api.post('/complaints', formData)

      if (response.data.success) {
        setMessage('Report submitted! Taking you to your reports…')
        setTimeout(() => navigate('/my-reports'), 1200)
      } else {
        setMessage(response.data.message || 'Unable to submit your report.')
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          'Unable to submit your report. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <main className="min-h-screen bg-[#f8f7f2] px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-orange-700"
        >
          <ArrowLeft size={17} />
          Back to home
        </Link>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main form */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <FileText size={24} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-orange-700">
              Make a difference
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Report a civic issue
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-stone-600">
              Tell us what needs attention in your neighbourhood. Clear
              details help people understand the problem.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Issue title <span className="text-red-600">*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  minLength={5}
                  maxLength={100}
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Large pothole near the school"
                  className="w-full rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />

                <p className="mt-2 text-xs text-stone-400">
                  Keep it short and specific.
                </p>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Category <span className="text-red-600">*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="">Choose an issue category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-stone-800"
                  >
                    Describe the problem{' '}
                    <span className="text-red-600">*</span>
                  </label>

                  <span className="text-xs text-stone-400">
                    {form.description.length}/1000
                  </span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What happened? Where exactly is the problem? How does it affect the neighbourhood?"
                  className="w-full resize-y rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Location */}
              
              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800"
                >
                  <MapPin size={17} className="text-orange-600" />
                  Issue location <span className="text-red-600">*</span>
                </label>

                <LocationPicker
                  value={point}
                  onChange={({ lat, lng, address }) => {
                    setPoint({ lat, lng })
                    setForm((current) => ({
                      ...current,
                      location: address || current.location,
                    }))
                  }}
                />

                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  minLength={3}
                  maxLength={200}
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Address fills in when you drop a pin (you can edit it)"
                  className="mt-3 w-full rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>
              {/* Optional photo */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  Add a photo <span className="font-normal text-stone-400">(optional)</span>
                </label>

                <label
                  htmlFor="photo"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-[#fdfcf9] px-5 py-8 text-center transition hover:border-orange-400 hover:bg-orange-50/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                    <Camera size={23} />
                  </div>

                  <span className="mt-3 text-sm font-semibold text-stone-800">
                    {photo ? 'Choose a different photo' : 'Click to upload a photo'}
                  </span>

                  <span className="mt-1 text-xs text-stone-500">
                    Image files only · Maximum 5 MB
                  </span>

                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>

                {photo && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-stone-100 p-3">
                    <Upload size={18} className="shrink-0 text-green-700" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800">
                        {photo.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {(photo.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove selected photo"
                      onClick={() => {
                        setPhoto(null)
                        setPhotoError('')
                        const input = document.getElementById('photo')
                        if (input) input.value = ''
                      }}
                      className="rounded-lg p-2 text-stone-500 hover:bg-white hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                {photoError && (
                  <p role="alert" className="mt-2 text-sm text-red-600">
                    {photoError}
                  </p>
                )}
              </div>

              {/* Submission feedback */}
              {message && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900"
                >
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                  <p>{message}</p>
                </div>
              )}

             <button
  type="submit"
  disabled={isSubmitting}
  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ed6a32] px-6 py-4 font-semibold text-white shadow-lg shadow-orange-600/15 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting ? 'Submitting…' : 'Submit report'}
</button>

              <p className="text-center text-xs leading-5 text-stone-500">
                Your report is saved to CivicPulse and shown on the public map.
              </p>
            </form>
          </section>

          {/* Helpful sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-[#24251f] p-6 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-orange-300">
                <ShieldCheck size={23} />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Help your community
              </h2>

              <p className="mt-3 text-sm leading-7 text-stone-300">
                Accurate details and a clear location make it easier to
                understand a civic issue and decide what action is needed.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <h2 className="font-bold text-stone-900">
                Before you submit
              </h2>

              <ul className="mt-4 space-y-4 text-sm leading-6 text-stone-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-700" />
                  Describe one clear issue.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-700" />
                  Include a useful landmark.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-700" />
                  Attach a relevant photo if available.
                </li>
              </ul>
            </div>

            <Link
              to="/explore"
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-700"
            >
              Explore existing issues
              <ArrowRight size={17} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Report
