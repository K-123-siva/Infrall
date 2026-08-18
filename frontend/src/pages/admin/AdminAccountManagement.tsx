import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Phone, Home, CheckCircle, Clock, Send, Eye } from 'lucide-react';
import api from '../../api';
import { DocumentList } from '../../components/common/DocumentViewer';

interface ListingDocument {
  id: number;
  title: string;
  category: string;
  status: string;
  price: number;
  city: string;
  images: string[];
  ownerDocuments: string[];
  thalukaDocuments: string[];
  agreementDocument: string | null;
  contactPerson: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  ownerAadhaar: string | null;
  ownerPan: string | null;
  commissionPercentage: number | null;
}

interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  passwordSetupToken: string | null;
  createdAt: string;
  propertyCount: number;
  activePropertyCount: number;
  rentedPropertyCount: number;
  Listings: ListingDocument[];
}

interface Vendor {
  id: number;
  businessName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  vendorType: string;
  isActive: boolean;
  user: {
    id: number;
    email: string;
    isVerified: boolean;
    passwordSetupToken: string | null;
  };
}

export default function AdminAccountManagement() {  const [activeTab, setActiveTab] = useState<'owners' | 'vendors'>('owners');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedOwner, setExpandedOwner] = useState<number | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    businessName: '',
    contactPerson: '',
    vendorType: 'home_services'
  });

  useEffect(() => {
    if (activeTab === 'owners') {
      fetchOwners();
    } else {
      fetchVendors();
    }
  }, [activeTab]);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/account-management/owners');
      setOwners(data.owners);
    } catch (error) {
      console.error('Error fetching owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/account-management/vendors');
      setVendors(data.vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      if (activeTab === 'owners') {
        await api.post('/account-management/owners/initiate', {
          email: formData.email,
          name: formData.name,
          phone: formData.phone
        });
        alert('Password setup email sent to owner!');
        fetchOwners();
      } else {
        await api.post('/account-management/vendors/initiate', {
          email: formData.email,
          businessName: formData.businessName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          vendorType: formData.vendorType
        });
        alert('Password setup email sent to vendor!');
        fetchVendors();
      }
      setShowAddModal(false);
      setFormData({ email: '', name: '', phone: '', businessName: '', contactPerson: '', vendorType: 'home_services' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create account');
    }
  };

  const handleResendEmail = async (id: number, type: 'owner' | 'vendor') => {
    try {
      if (type === 'owner') {
        await api.post(`/account-management/owners/${id}/resend`);
      } else {
        await api.post(`/account-management/vendors/${id}/resend`);
      }
      alert('Setup email resent successfully!');
    } catch (error) {
      alert('Failed to resend email');
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
          Account Management
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Manage auto-created owner accounts and set login credentials
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid #e2e8f0' }}>
        <button
          onClick={() => setActiveTab('owners')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'owners' ? '#667eea' : 'transparent',
            color: activeTab === 'owners' ? '#fff' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'owners' ? '3px solid #667eea' : 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          <Users size={16} style={{ display: 'inline', marginRight: 8 }} />
          Owner Accounts
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'vendors' ? '#10b981' : 'transparent',
            color: activeTab === 'vendors' ? '#fff' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'vendors' ? '3px solid #10b981' : 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          <Users size={16} style={{ display: 'inline', marginRight: 8 }} />
          Vendor Accounts
        </button>
      </div>

      {/* Add Account Button */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          background: activeTab === 'owners' ? '#667eea' : '#10b981',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <UserPlus size={18} />
        Add {activeTab === 'owners' ? 'Owner' : 'Vendor'} Account
      </button>

      {/* Owner Accounts List */}
      {activeTab === 'owners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
          ) : owners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12 }}>
              <p style={{ color: '#64748b' }}>No owner accounts found</p>
            </div>
          ) : (
            owners.map(owner => (
              <div key={owner.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Owner Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18
                      }}>
                        {owner.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', margin: 0 }}>
                          {owner.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          {owner.passwordSetupToken ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#f59e0b' }}>
                              <Clock size={14} /> Pending Setup
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#10b981' }}>
                              <CheckCircle size={14} /> Verified
                            </span>
                          )}
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>
                            Created {new Date(owner.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Mail size={16} color="#64748b" />
                        <span style={{ fontSize: 14, color: '#475569' }}>{owner.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Phone size={16} color="#64748b" />
                        <span style={{ fontSize: 14, color: '#475569' }}>{owner.phone || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Property Stats */}
                    <div style={{ display: 'flex', gap: 16, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#667eea' }}>{owner.propertyCount || 0}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Total Properties</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>{owner.activePropertyCount || 0}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Active</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>{owner.rentedPropertyCount || 0}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Rented</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 20 }}>
                    {owner.passwordSetupToken && (
                      <button
                        onClick={() => handleResendEmail(owner.id, 'owner')}
                        style={{
                          background: '#667eea',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Send size={14} /> Resend Email
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedOwner(expandedOwner === owner.id ? null : owner.id)}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Eye size={14} /> {expandedOwner === owner.id ? 'Hide' : 'View'} Properties
                    </button>
                  </div>
                </div>

                {/* Expanded Properties */}
                {expandedOwner === owner.id && owner.Listings && owner.Listings.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
                      Properties ({owner.Listings.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {owner.Listings.map(property => {
                          return (
                          <div key={property.id} style={{ background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            {/* Property Header */}
                            <div style={{ display: 'flex', gap: 12, padding: 12 }}>
                              {property.images && property.images.length > 0 ? (
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                                />
                              ) : (
                                <div style={{ width: 80, height: 80, background: '#e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Home size={28} color="#94a3b8" />
                                </div>
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{property.title}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                                  {property.city} • {property.category.replace('_', ' ')}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: '#667eea' }}>
                                    ₹{property.price?.toLocaleString()}
                                  </span>
                                  <span style={{
                                    fontSize: 11, padding: '2px 8px', borderRadius: 4,
                                    background: property.status === 'active' ? '#d1fae5' : property.status === 'rented' ? '#fef3c7' : '#fee2e2',
                                    color: property.status === 'active' ? '#065f46' : property.status === 'rented' ? '#92400e' : '#991b1b'
                                  }}>
                                    {property.status}
                                  </span>
                                </div>
                                {property.commissionPercentage != null && (
                                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                                    Commission: <strong>{property.commissionPercentage}%</strong>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Documents Section */}
                            <div style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                              <DocumentList
                                ownerDocuments={property.ownerDocuments}
                                thalukaDocuments={property.thalukaDocuments}
                                agreementDocument={property.agreementDocument}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Vendor Accounts List */}
      {activeTab === 'vendors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
          ) : vendors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12 }}>
              <p style={{ color: '#64748b' }}>No vendor accounts found</p>
            </div>
          ) : (
            vendors.map(vendor => (
              <div key={vendor.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18
                      }}>
                        {vendor.businessName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', margin: 0 }}>
                          {vendor.businessName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          {vendor.user.passwordSetupToken ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#f59e0b' }}>
                              <Clock size={14} /> Pending Setup
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#10b981' }}>
                              <CheckCircle size={14} /> Active
                            </span>
                          )}
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>
                            {vendor.vendorType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Mail size={16} color="#64748b" />
                        <span style={{ fontSize: 14, color: '#475569' }}>{vendor.contactEmail}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Phone size={16} color="#64748b" />
                        <span style={{ fontSize: 14, color: '#475569' }}>{vendor.contactPhone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {vendor.user.passwordSetupToken && (
                    <button
                      onClick={() => handleResendEmail(vendor.id, 'vendor')}
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginLeft: 20
                      }}
                    >
                      <Send size={14} /> Resend Email
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1e293b' }}>
              Add {activeTab === 'owners' ? 'Owner' : 'Vendor'} Account
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              {activeTab === 'owners' ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Owner name"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone number"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Business name"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Contact person name"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone number"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
                      Vendor Type
                    </label>
                    <select
                      value={formData.vendorType}
                      onChange={(e) => setFormData({ ...formData, vendorType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14
                      }}
                    >
                      <option value="home_services">Home Services</option>
                      <option value="building_materials">Building Materials</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={handleAddAccount}
                disabled={!formData.email}
                style={{
                  flex: 1,
                  background: activeTab === 'owners' ? '#667eea' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 8,
                  cursor: formData.email ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                  fontSize: 14,
                  opacity: formData.email ? 1 : 0.5
                }}
              >
                Send Setup Email
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ email: '', name: '', phone: '', businessName: '', contactPerson: '', vendorType: 'home_services' });
                }}
                style={{
                  flex: 1,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
