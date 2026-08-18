import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, User, FileText, Home, CheckCircle, XCircle, Clock, Shield, Package, Sofa, Wrench, Hammer, Eye, X, Store } from 'lucide-react';
import api from '../../api';
import { DocumentButton } from '../../components/common/DocumentViewer';

interface RequestUser { id: number; name: string; email: string; phone: string; }
interface RequestProperty { id: number; title: string; price: number; location: string; city: string; category: string; images: string[]; }
interface Request {
  id: number; type: string; typeLabel: string; status: string;
  createdAt: string; updatedAt: string;
  user: RequestUser; property: RequestProperty | null; details: any;
}
interface RequestCounts {
  total: number; buy_request: number; rental_request: number; vacate_request: number;
  visit_booking: number; kyc_request: number; furniture_inquiry: number;
  service_inquiry: number; service_requests: number; services: number;
  material_inquiry: number; pending: number; active: number; approved: number;
  completed: number; rejected: number; read: number;
}
interface Vendor { id: number; businessName: string; contactPerson: string; contactPhone: string; vendorType: string; categories: string[]; isActive: boolean; }

type TabType = 'kyc' | 'buy' | 'vacate' | 'visit' | 'furniture' | 'services' | 'materials';

export default function AdminAllRequests() {
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [counts, setCounts] = useState<RequestCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('kyc');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Vendor assignment state
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assignModal, setAssignModal] = useState<Request | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  useEffect(() => { fetchAllRequests(); fetchVendors(); }, []);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/requests/all');
      setAllRequests(data.requests);
      setCounts(data.counts);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data } = await api.get('/admin/vendors');
      setVendors((data.vendors || data || []).filter((v: Vendor) => v.isActive));
    } catch (e) {
      console.error('Failed to fetch vendors:', e);
    }
  };

  const openAssignModal = (request: Request) => {
    setAssignModal(request);
    setSelectedVendorId('');
    setAssignNotes(request.details?.adminNotes || '');
    setAssignError('');
  };

  // Returns the required vendorType for a given request type
  const getRequiredVendorType = (requestType: string): string | null => {
    if (requestType === 'service_request' || requestType === 'service_inquiry') return 'home_services';
    if (requestType === 'material_inquiry') return 'building_materials';
    return null;
  };

  // Check if a vendor's categories match the requested service type
  const vendorMatchesService = (vendor: Vendor, serviceType: string): boolean => {
    if (!serviceType || !vendor.categories?.length) return false;
    const svc = serviceType.toLowerCase();
    return vendor.categories.some(cat => {
      const c = cat.toLowerCase();
      return c.includes(svc) || svc.includes(c);
    });
  };

  // Vendors filtered by type, then sorted: best-match first
  const filteredVendors = (() => {
    if (!assignModal) return vendors;
    const required = getRequiredVendorType(assignModal.type);
    const byType = required ? vendors.filter(v => v.vendorType === required) : vendors;
    const serviceType = assignModal.details?.serviceType || '';
    if (!serviceType) return byType;
    // Sort: matching categories first
    return [...byType].sort((a, b) => {
      const aMatch = vendorMatchesService(a, serviceType) ? 0 : 1;
      const bMatch = vendorMatchesService(b, serviceType) ? 0 : 1;
      return aMatch - bMatch;
    });
  })();

  const vendorTypeLabel = (type: string) =>
    type === 'home_services' ? 'Home Services' :
    type === 'building_materials' ? 'Building Materials' : type;

  const selectedVendor = filteredVendors.find(v => v.id === parseInt(selectedVendorId));

  const handleAssignVendor = async () => {
    if (!assignModal) return;
    if (!selectedVendorId) {
      setAssignError('Please select a vendor to assign.');
      return;
    }
    setAssigning(true);
    setAssignError('');
    try {
      if (assignModal.type === 'material_inquiry') {
        await api.put(`/admin/listings/${assignModal.property?.id}`, {
          vendorId: parseInt(selectedVendorId),
        });
      } else {
        await api.post(`/service-requests/${assignModal.id}/assign`, {
          vendorId: parseInt(selectedVendorId),
          adminNotes: assignNotes,
        });
      }
      setAssignModal(null);
      fetchAllRequests();
    } catch (e: any) {
      setAssignError(e.response?.data?.message || 'Failed to assign vendor.');
    } finally {
      setAssigning(false);
    }
  };

  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'kyc': return allRequests.filter(r => r.type === 'kyc_request');
      case 'buy': return allRequests.filter(r => r.type === 'buy_request');
      case 'vacate': return allRequests.filter(r => r.type === 'vacate_request');
      case 'visit': return allRequests.filter(r => r.type === 'visit_booking');
      case 'furniture': return allRequests.filter(r => r.type === 'furniture_inquiry' || r.type === 'furniture_rental');
      case 'services': return allRequests.filter(r => r.type === 'service_inquiry' || r.type === 'service_request');
      case 'materials': return allRequests.filter(r => r.type === 'material_inquiry');
      default: return allRequests;
    }
  };

  const handleAcceptRequest = async (request: Request) => {
    if (!confirm(`Accept this ${request.typeLabel}?`)) return;
    try {
      switch (request.type) {
        case 'buy_request': await api.put(`/buy-requests/${request.id}/status`, { status: 'approved' }); break;
        case 'vacate_request': await api.post(`/property-rentals/${request.id}/complete-vacate`, { approvedBy: 'Admin', approvalDate: new Date().toISOString().split('T')[0] }); break;
        case 'visit_booking': await api.put(`/visit-bookings/${request.id}`, { status: 'confirmed' }); break;
        case 'kyc_request': await api.put(`/kyc/${request.id}`, { status: 'verified' }); break;
        case 'furniture_rental': await api.put(`/purchase/${request.id}/status`, { status: 'confirmed', adminNotes: 'Approved by admin' }); break;
        default: alert('Action not supported for this request type'); return;
      }
      alert('Request accepted!');
      fetchAllRequests();
    } catch { alert('Failed to accept request.'); }
  };

  const handleRejectRequest = async (request: Request) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    try {
      switch (request.type) {
        case 'buy_request': await api.put(`/buy-requests/${request.id}/status`, { status: 'rejected', adminNotes: reason }); break;
        case 'visit_booking': await api.put(`/visit-bookings/${request.id}`, { status: 'cancelled', adminNotes: reason }); break;
        case 'kyc_request': await api.put(`/kyc/${request.id}`, { status: 'rejected', adminNotes: reason }); break;
        case 'furniture_rental': await api.put(`/purchase/${request.id}/status`, { status: 'cancelled', adminNotes: reason }); break;
        default: alert('Action not supported for this request type'); return;
      }
      alert('Request rejected!');
      fetchAllRequests();
    } catch { alert('Failed to reject request.'); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const statusColor = (s: string) => {
    if (s === 'pending') return { bg: '#fef3c7', color: '#92400e' };
    if (s === 'assigned') return { bg: '#dbeafe', color: '#1e40af' };
    if (s === 'active' || s === 'approved' || s === 'verified' || s === 'completed') return { bg: '#d1fae5', color: '#065f46' };
    if (s === 'rejected' || s === 'cancelled') return { bg: '#fee2e2', color: '#991b1b' };
    return { bg: '#f3f4f6', color: '#374151' };
  };

  const tabs = [
    { id: 'kyc' as TabType, label: 'KYC', icon: Shield, count: counts?.kyc_request || 0 },
    { id: 'buy' as TabType, label: 'Buy Requests', icon: Home, count: counts?.buy_request || 0 },
    { id: 'vacate' as TabType, label: 'Vacate', icon: Package, count: counts?.vacate_request || 0 },
    { id: 'visit' as TabType, label: 'Visit Bookings', icon: Eye, count: counts?.visit_booking || 0 },
    { id: 'furniture' as TabType, label: 'Furniture', icon: Sofa, count: counts?.furniture_inquiry || 0 },
    { id: 'services' as TabType, label: 'Services', icon: Wrench, count: (counts?.services ?? counts?.service_inquiry) || 0 },
    { id: 'materials' as TabType, label: 'Materials', icon: Hammer, count: counts?.material_inquiry || 0 },
  ];

  const filteredRequests = getFilteredRequests();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>All Requests</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '4px', fontSize: '14px' }}>
            {counts?.total || 0} total · {counts?.pending || 0} pending
          </p>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px',
                borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                background: isActive ? '#fff' : 'rgba(255,255,255,0.2)',
                color: isActive ? '#4f46e5' : '#fff',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              }}>
                <Icon size={14} />
                {tab.label}
                <span style={{ padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', background: isActive ? '#e0e7ff' : 'rgba(255,255,255,0.3)', color: isActive ? '#4f46e5' : '#fff' }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#667eea', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6b7280' }}>Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <FileText size={56} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>No Requests</h3>
            <p style={{ color: '#6b7280' }}>No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} at the moment</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRequests.map(request => {
              const sc = statusColor(request.status);
              const isServiceRequest = request.type === 'service_request';
              const isAssigned = request.status === 'assigned';
              return (
                <div key={`${request.type}-${request.id}`} style={{
                  background: '#fff', borderRadius: '14px', padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '16px', alignItems: 'flex-start'
                }}>
                  {/* Image */}
                  {request.property?.images?.[0] && (
                    <img src={request.property.images[0]} alt="" style={{ width: '76px', height: '76px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                  )}

                  {/* Main content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                        {request.property ? request.property.title : request.typeLabel}
                      </h3>
                      <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: sc.bg, color: sc.color }}>
                        {request.status.toUpperCase()}
                      </span>
                      {isServiceRequest && (
                        <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: '#f3e8ff', color: '#7c3aed' }}>
                          {request.details?.serviceType}
                        </span>
                      )}
                    </div>

                    {request.property && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <MapPin size={13} color="#9ca3af" />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{request.property.location}, {request.property.city}</span>
                      </div>
                    )}

                    {isServiceRequest && request.details?.problemDescription && (
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 8px', lineHeight: '1.4' }}>
                        {request.details.problemDescription.length > 100
                          ? request.details.problemDescription.substring(0, 100) + '...'
                          : request.details.problemDescription}
                      </p>
                    )}

                    {/* User info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', background: '#f0f9ff', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={13} color="#6b7280" />
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{request.user.name}</span>
                      </div>
                      {request.user.phone && (
                        <a href={`tel:${request.user.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4b5563', textDecoration: 'none' }}>
                          <Phone size={13} color="#6b7280" />{request.user.phone}
                        </a>
                      )}
                      <a href={`mailto:${request.user.email}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4b5563', textDecoration: 'none' }}>
                        <Mail size={13} color="#6b7280" />{request.user.email}
                      </a>
                    </div>

                    {/* Assigned vendor info */}
                    {isServiceRequest && isAssigned && request.details?.workerName && (
                      <div style={{ marginTop: '10px', background: '#d1fae5', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Store size={14} color="#065f46" />
                        <span style={{ color: '#065f46', fontWeight: '600' }}>
                          Assigned: {request.details.vendorName || request.details.workerName}
                          {request.details.workerPhone && ` · ${request.details.workerPhone}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => setSelectedRequest(request)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
                      background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                    }}>
                      <Eye size={14} /> View
                    </button>

                    {/* Assign Vendor button — for service_request AND material_inquiry */}
                    {(isServiceRequest || request.type === 'material_inquiry') && (
                      <button onClick={() => openAssignModal(request)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
                        background: isAssigned ? '#d1fae5' : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                        color: isAssigned ? '#065f46' : '#fff',
                        border: isAssigned ? '1px solid #6ee7b7' : 'none',
                        borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                      }}>
                        <Store size={14} />
                        {isAssigned ? 'Reassign' : 'Assign Vendor'}
                      </button>
                    )}

                    {/* Accept/Reject for non-service requests */}
                    {!isServiceRequest && request.status === 'pending' && (
                      <>
                        <button onClick={() => handleAcceptRequest(request)} style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
                          background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px',
                          fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                        }}>
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button onClick={() => handleRejectRequest(request)} style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
                          background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px',
                          fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                        }}>
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ASSIGN VENDOR MODAL ── */}
      {assignModal && (
        <div onClick={() => setAssignModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0 }}>Assign Vendor / Worker</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: '4px 0 0' }}>
                  {assignModal.details?.serviceType} · {assignModal.user.name}
                </p>
              </div>
              <button onClick={() => setAssignModal(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#fff' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Request summary */}
              <div style={{ background: '#f5f3ff', borderRadius: '10px', padding: '14px 16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', color: '#4c1d95' }}>Request Summary</span>
                  {/* Vendor type badge */}
                  {getRequiredVendorType(assignModal.type) && (
                    <span style={{
                      padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                      background: getRequiredVendorType(assignModal.type) === 'home_services' ? '#dbeafe' : '#fef3c7',
                      color: getRequiredVendorType(assignModal.type) === 'home_services' ? '#1e40af' : '#92400e'
                    }}>
                      {getRequiredVendorType(assignModal.type) === 'home_services' ? '🔧 Home Services Vendor' : '🧱 Building Materials Vendor'}
                    </span>
                  )}
                </div>
                <div style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '13px' }}>
                  {assignModal.details?.serviceType && <div><b>Service:</b> {assignModal.details.serviceType}</div>}
                  {assignModal.details?.problemDescription && <div><b>Problem:</b> {assignModal.details.problemDescription}</div>}
                  {assignModal.details?.userAddress && <div><b>Address:</b> {assignModal.details.userAddress}</div>}
                  {assignModal.details?.userPhone && <div><b>Phone:</b> {assignModal.details.userPhone}</div>}
                  {assignModal.property && <div><b>Listing:</b> {assignModal.property.title} · {assignModal.property.city}</div>}
                </div>
              </div>

              {/* Vendor dropdown — filtered by type, sorted by service match */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                  <Store size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  Select{' '}
                  {getRequiredVendorType(assignModal.type) === 'home_services' && <span style={{ color: '#1e40af' }}>Home Services</span>}
                  {getRequiredVendorType(assignModal.type) === 'building_materials' && <span style={{ color: '#92400e' }}>Building Materials</span>}
                  {!getRequiredVendorType(assignModal.type) && 'Registered'}
                  {' '}Vendor
                  {assignModal.details?.serviceType && (
                    <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', background: '#ede9fe', color: '#6d28d9' }}>
                      for: {assignModal.details.serviceType}
                    </span>
                  )}
                </label>

                {filteredVendors.length === 0 ? (
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#92400e' }}>
                    ⚠️ No active{' '}
                    <b>{getRequiredVendorType(assignModal.type) === 'home_services' ? 'Home Services' : 'Building Materials'}</b>
                    {' '}vendors found. Add one from <b>Admin → Vendors</b>, or assign manually below.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredVendors.map(v => {
                      const isMatch = vendorMatchesService(v, assignModal.details?.serviceType || '');
                      const isSelected = selectedVendorId === String(v.id);
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVendorId(String(v.id))}
                          style={{
                            border: isSelected ? '2px solid #7c3aed' : isMatch ? '1.5px solid #a78bfa' : '1.5px solid #e5e7eb',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            cursor: 'pointer',
                            background: isSelected ? '#f5f3ff' : isMatch ? '#faf5ff' : '#fff',
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* Radio indicator */}
                              <div style={{
                                width: '16px', height: '16px', borderRadius: '50%',
                                border: isSelected ? '5px solid #7c3aed' : '2px solid #d1d5db',
                                flexShrink: 0, transition: 'all 0.15s'
                              }} />
                              <span style={{ fontWeight: '700', fontSize: '14px', color: '#1f2937' }}>{v.businessName}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              {isMatch && (
                                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', background: '#d1fae5', color: '#065f46' }}>
                                  ✓ Best Match
                                </span>
                              )}
                              <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', background: '#ede9fe', color: '#6d28d9' }}>
                                {vendorTypeLabel(v.vendorType)}
                              </span>
                            </div>
                          </div>
                          <div style={{ paddingLeft: '24px', fontSize: '13px', color: '#6b7280' }}>
                            {v.contactPerson} · {v.contactPhone}
                          </div>
                          {v.categories?.length > 0 && (
                            <div style={{ paddingLeft: '24px', marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {v.categories.map((c: string) => {
                                const catMatch = assignModal.details?.serviceType &&
                                  (c.toLowerCase().includes(assignModal.details.serviceType.toLowerCase()) ||
                                   assignModal.details.serviceType.toLowerCase().includes(c.toLowerCase()));
                                return (
                                  <span key={c} style={{
                                    padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600',
                                    background: catMatch ? '#d1fae5' : '#f3f4f6',
                                    color: catMatch ? '#065f46' : '#6b7280',
                                    border: catMatch ? '1px solid #6ee7b7' : '1px solid transparent'
                                  }}>{c}</span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Admin notes */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Admin Notes (optional)</label>
                <textarea
                  value={assignNotes}
                  onChange={e => setAssignNotes(e.target.value)}
                  placeholder="Any instructions for the worker..."
                  rows={3}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              {assignError && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                  ⚠️ {assignError}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAssignModal(null)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1.5px solid #d1d5db', background: '#fff', color: '#374151', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleAssignVendor} disabled={assigning} style={{
                  flex: 2, padding: '11px', borderRadius: '8px', border: 'none',
                  background: assigning ? '#a78bfa' : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                  color: '#fff', fontSize: '14px', fontWeight: '700', cursor: assigning ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <Store size={16} />
                  {assigning ? 'Assigning...' : 'Assign Vendor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW DETAILS MODAL ── */}
      {selectedRequest && (
        <div onClick={() => setSelectedRequest(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px 16px 0 0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{selectedRequest.typeLabel}</h2>
              <button onClick={() => setSelectedRequest(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* User */}
              <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '18px', border: '1px solid #bfdbfe' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e40af', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <User size={16} /> User Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div><div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>Name</div><div style={{ fontWeight: '600', color: '#1f2937' }}>{selectedRequest.user.name}</div></div>
                  <div><div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>Email</div><a href={`mailto:${selectedRequest.user.email}`} style={{ color: '#4f46e5', fontWeight: '500' }}>{selectedRequest.user.email}</a></div>
                  <div><div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>Phone</div><a href={`tel:${selectedRequest.user.phone}`} style={{ color: '#4f46e5', fontWeight: '600' }}>{selectedRequest.user.phone}</a></div>
                  <div><div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>Status</div>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...statusColor(selectedRequest.status) }}>{selectedRequest.status}</span>
                  </div>
                </div>
              </div>

              {/* Property */}
              {selectedRequest.property && (
                <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '18px', border: '1px solid #bbf7d0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#166534', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Home size={16} /> Property
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                    <div style={{ gridColumn: '1/-1' }}><div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>Title</div><div style={{ fontWeight: '600', color: '#1f2937' }}>{selectedRequest.property.title}</div></div>
                    <div><div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>Price</div><div style={{ fontWeight: '700', color: '#10b981' }}>{formatPrice(selectedRequest.property.price)}</div></div>
                    <div><div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>Location</div><div style={{ color: '#1f2937' }}>{selectedRequest.property.location}, {selectedRequest.property.city}</div></div>
                  </div>
                </div>
              )}

              {/* Details */}
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '18px', border: '1px solid #fde68a' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#92400e', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <FileText size={16} /> Request Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  {Object.entries(selectedRequest.details || {}).map(([key, val]) => {
                    if (!val || key === 'adminNotes') return null;
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                    const strVal = String(val);
                    const isUrl = typeof val === 'string' && (
                      val.startsWith('http') ||
                      val.startsWith('/uploads') ||
                      val.startsWith('/api/kyc/file/')
                    );
                    return (
                      <div key={key}>
                        <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '3px' }}>{label}</div>
                        {isUrl ? (
                          <DocumentButton url={strVal} label={label} />
                        ) : (
                          <div style={{ color: '#1f2937', fontWeight: '500' }}>{strVal}</div>
                        )}
                      </div>
                    );
                  })}
                  {selectedRequest.details?.adminNotes && (
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '3px' }}>Admin Notes</div>
                      <div style={{ color: '#dc2626', fontWeight: '500' }}>{selectedRequest.details.adminNotes}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Assign button inside detail modal for service requests */}
              {(selectedRequest.type === 'service_request' || selectedRequest.type === 'material_inquiry') && (
                <button onClick={() => { setSelectedRequest(null); openAssignModal(selectedRequest); }} style={{
                  padding: '12px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <Store size={16} />
                  {selectedRequest.status === 'assigned' ? 'Reassign Vendor / Worker' : 'Assign Vendor / Worker'}
                </button>
              )}

              {/* Accept/Reject inside modal */}
              {selectedRequest.status === 'pending' && selectedRequest.type !== 'service_request' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { handleAcceptRequest(selectedRequest); setSelectedRequest(null); }} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Accept
                  </button>
                  <button onClick={() => { handleRejectRequest(selectedRequest); setSelectedRequest(null); }} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
