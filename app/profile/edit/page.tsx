"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Address {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export default function EditProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState<Address>({})

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('You are not logged in.')
          setLoading(false)
          return
        }
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.message || 'Failed to load profile')
          setLoading(false)
          return
        }
        const u = json.data
        setName(u?.name || '')
        setEmail(u?.email || '')
        setPhone(u?.phone || '')
        setAddress(u?.address || {})
      } catch (e) {
        setError('Network error while loading profile')
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [])

  const onSave = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, phone, address })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message || 'Failed to update profile')
      } else {
        setSuccess('Profile updated successfully')
        // Redirect to profile after short delay
        setTimeout(() => {
          router.push('/profile')
        }, 800)
      }
    } catch (e) {
      setError('Network error while saving')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/profile" className="text-orange-600 hover:text-orange-700">← Back to Profile</Link>
        </div>

        <div className="card-modern p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          ) : (
            <form onSubmit={onSave} className="space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>}
              {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">{success}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input value={address.street || ''} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input value={address.city || ''} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input value={address.state || ''} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input value={address.zipCode || ''} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input value={address.country || ''} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="form-input" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving} className="btn-primary px-8 py-3">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link href="/profile" className="btn-secondary px-8 py-3">Cancel</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}


