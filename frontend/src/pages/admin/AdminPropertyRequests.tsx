import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, X, Home } from 'lucide-react';
import api from '../../api';

export default function AdminPropertyRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selected, setSelected] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  useEffect(() => { fetchRequests(); }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get(`/property-requests/admin/all?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, status: 'approved' | 'rejected') => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/property-requests/admin/${id}`, { status, adminNotes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelected(null);
      setAdminNotes('');
      fetchRequests();
    } catch (err) {
      alert('Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: any = {
      pending:  { bg: '#fef3c7', color: '#92400e', icon: <Clock size={12} />,       label: 'Pending' },
      approved: { bg: '#d1fae5', color: '#065f46', icon: <CheckCircle size={12} />, label: 'Approved' },
      rejected: { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={12} />,     label: 'Rejected' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
        {s.icon} {s.label}
      </span>
    );
  };

  return (
    <div style={{ padding: 32, background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0 }}>Property Requests</h1>
        </div>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Review and approve property listing requests from users</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, textTransform: 'capitalize',
              background: filter === s ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#fff',
              color: filter === s ? '#fff' : '#64748b',
              boxShadow: filter === s ? '0 4px 12px rgba(249,115,22,0.3)' : '0 1px 4px rgba(0,0,0,0.08)'
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b', background: '#fff', borderRadius: 16 }}>
          <Home size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p>No {filter} requests</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Owner', 'Property', 'Type', 'City', 'Price', 'Photos', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{req.ownerName}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{req.ownerEmail}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{req.ownerPhone}</div>
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{req.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{req.address?.slice(0, 50)}{req.address?.length > 50 ? '...' : ''}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6, background: req.listingType === 'property_rent' ? '#dbeafe' : '#fce7f3', color: req.listingType === 'property_rent' ? '#1e40af' : '#9d174d' }}>
                      {req.listingType === 'property_rent' ? 'Rent' : 'Sell'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>{req.city}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#059669' }}>
                    {req.price ? `₹${Number(req.price).toLocaleString()}` : '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {req.photos?.length > 0 ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        {req.photos.slice(0, 3).map((p: string, idx: number) => (
                          <img key={idx} src={p} alt="" onClick={() => setPhotoModal(p)}
                            style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: '1px solid #e2e8f0' }} />
                        ))}
                        {req.photos.length > 3 && (
                          <div style={{ width: 36, height: 36, borderRadius: 6, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                            +{req.photos.length - 3}
                          </div>
                        )}
                      </div>
                    ) : <span style={{ fontSize: 12, color: '#94a3b8' }}>No photos</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(req.status)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748b' }}>
                    {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => { setSelected(req); setAdminNotes(req.adminNotes || ''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      <Eye size={14} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 680, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>

            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', margin: 0 }}>{selected.title}</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Submitted by {selected.ownerName}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="#64748b" />
              </button>
            </div>

            <div style={{ padding: 24 }}>

              {/* Owner Info */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Owner Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Name</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.ownerName}</div></div>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Email</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.ownerEmail}</div></div>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Phone</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.ownerPhone}</div></div>
                </div>
              </div>

              {/* Property Info */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Property Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Type</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.listingType === 'property_rent' ? 'For Rent' : 'For Sale'}</div></div>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>City</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.city}</div></div>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Price</div><div style={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>{selected.price ? `₹${Number(selected.price).toLocaleString()}` : 'Not specified'}</div></div>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Area</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.area || '—'} sq.ft</div></div>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Bedrooms</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.bedrooms || '—'}</div></div>
                  <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Bathrooms</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{selected.bathrooms || '—'}</div></div>
                </div>
                <div><div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Address</div><div style={{ fontSize: 14, color: '#1e293b' }}>{selected.address}</div></div>
                {selected.description && (
                  <div style={{ marginTop: 12 }}><div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Description</div><div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{selected.description}</div></div>
                )}
              </div>

              {/* Photos */}
              {selected.photos?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Photos ({selected.photos.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                    {selected.photos.map((p: string, i: number) => (
                      <img key={i} src={p} alt="" onClick={() => setPhotoModal(p)}
                        style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: '1px solid #e2e8f0', transition: 'transform 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selected.status === 'pending' && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Admin Notes (optional)</label>
                  <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Add notes for the user (e.g. reason for rejection, what to fix)..."
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              )}

              {selected.adminNotes && selected.status !== 'pending' && (
                <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>Admin Notes</div>
                  <div style={{ fontSize: 14, color: '#78350f' }}>{selected.adminNotes}</div>
                </div>
              )}

              {/* Action Buttons */}
              {selected.status === 'pending' && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => handleAction(selected.id, 'approved')} disabled={updating}
                    style={{ flex: 1, padding: '13px', background: updating ? '#94a3b8' : 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <CheckCircle size={18} /> {updating ? 'Processing...' : 'Approve & Add to Listings'}
                  </button>
                  <button onClick={() => handleAction(selected.id, 'rejected')} disabled={updating}
                    style={{ flex: 1, padding: '13px', background: updating ? '#94a3b8' : 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}

              {selected.status !== 'pending' && (
                <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 10 }}>
                  {statusBadge(selected.status)}
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>This request has already been {selected.status}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {photoModal && (
        <div onClick={() => setPhotoModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 20 }}>
          <img src={photoModal} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }} />
        </div>
      )}
    </div>
  );
}
