import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle, ArrowLeft, Home, Tag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api';

export default function PostPropertyRequestPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ownerName: user?.name || '',
    ownerEmail: user?.email || '',
    ownerPhone: '',
    listingType: 'property_rent' as 'property_rent' | 'property_sell',
    title: '',
    address: '',
    city: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 10) {
      setError('Maximum 10 photos allowed.');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    setError('');
  };

  const removePhoto = (i: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.ownerName || !form.ownerEmail || !form.ownerPhone || !form.title || !form.address || !form.city) {
      setError('Please fill in all required fields.');
      return;
    }

    if (photos.length === 0) {
      setError('Please upload at least one photo of the property.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach(p => fd.append('photos', p));

      await api.post('/property-requests', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    background: '#f8fafc',
    color: '#1e293b',
    boxSizing: 'border-box'
  };

  const label: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fff7ed,#fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 48, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="#fff" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Request Submitted!</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 8 }}>
            Your property request has been sent to our admin team.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>
            We'll review it and add it to the listings within 24 hours. You can track the status in your account.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/account?tab=my-requests')}
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Track My Requests
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '12px 24px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#fff7ed,#fef3c7,#fff7ed)', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#92400e', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Home size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Post Your Property</h1>
          <p style={{ fontSize: 15, color: '#64748b' }}>
            Fill in the details below. Our admin team will verify and list your property within 24 hours.
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 16px 48px rgba(0,0,0,0.08)', padding: '36px 40px', border: '1px solid #f1f5f9' }}>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 24, fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Listing Type */}
            <div style={{ marginBottom: 24 }}>
              <label style={label}>I want to *</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { value: 'property_rent', icon: '🏠', text: 'Give for Rent' },
                  { value: 'property_sell', icon: '🏷️', text: 'Sell My Property' }
                ].map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm({ ...form, listingType: opt.value as any })}
                    style={{
                      flex: 1, padding: '16px', borderRadius: 12, cursor: 'pointer',
                      border: form.listingType === opt.value ? '2px solid #f97316' : '1.5px solid #e2e8f0',
                      background: form.listingType === opt.value ? '#fff7ed' : '#f8fafc',
                      color: form.listingType === opt.value ? '#ea580c' : '#374151',
                      fontWeight: 700, fontSize: 15, transition: 'all 0.15s'
                    }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{opt.icon}</div>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#f1f5f9', marginBottom: 24 }} />

            {/* Owner Details */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Your Contact Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={label}>Full Name *</label>
                <input name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Your full name" style={inp} required />
              </div>
              <div>
                <label style={label}>Phone Number *</label>
                <input name="ownerPhone" value={form.ownerPhone} onChange={handleChange} placeholder="10-digit mobile number" style={inp} required maxLength={10} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={label}>Email Address *</label>
              <input name="ownerEmail" type="email" value={form.ownerEmail} onChange={handleChange} placeholder="your@email.com" style={inp} required />
            </div>

            <div style={{ height: 1, background: '#f1f5f9', marginBottom: 24 }} />

            {/* Property Details */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Property Details</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={label}>Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 2BHK Apartment in Koramangala" style={inp} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={label}>Full Address *</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Street, locality, landmark..." style={inp} required />
              </div>
              <div>
                <label style={label}>City *</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" style={inp} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={label}>{form.listingType === 'property_rent' ? 'Monthly Rent (₹)' : 'Selling Price (₹)'}</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Amount" style={inp} />
              </div>
              <div>
                <label style={label}>Bedrooms</label>
                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} placeholder="e.g. 2" style={inp} min="0" />
              </div>
              <div>
                <label style={label}>Bathrooms</label>
                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} placeholder="e.g. 1" style={inp} min="0" />
              </div>
              <div>
                <label style={label}>Area (sq.ft)</label>
                <input name="area" value={form.area} onChange={handleChange} placeholder="e.g. 1200" style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={label}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the property — amenities, nearby facilities, condition, etc."
                rows={4}
                style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            <div style={{ height: 1, background: '#f1f5f9', marginBottom: 24 }} />

            {/* Photo Upload */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Property Photos *</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Upload up to 10 photos. Clear photos help admin verify faster.</p>

            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '28px', border: '2px dashed #fed7aa', borderRadius: 12,
              background: '#fff7ed', cursor: 'pointer', marginBottom: 16, transition: 'all 0.2s'
            }}>
              <Upload size={28} color="#f97316" style={{ marginBottom: 8 }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f97316' }}>Click to upload photos</span>
              <span style={{ fontSize: 12, color: '#92400e', marginTop: 4 }}>JPG, PNG, WEBP — max 10MB each</span>
              <input type="file" multiple accept="image/*" onChange={handlePhotos} style={{ display: 'none' }} />
            </label>

            {previews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: 24 }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={src} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <button type="button" onClick={() => removePhoto(i)}
                      style={{ position: 'absolute', top: 4, right: 4, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px', background: loading ? '#fdba74' : 'linear-gradient(135deg,#f97316,#ea580c)',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 6px 16px rgba(249,115,22,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              <Tag size={18} />
              {loading ? 'Submitting...' : 'Submit Property Request'}
            </button>

            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 12 }}>
              Our admin team will review your request and add it to listings within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
