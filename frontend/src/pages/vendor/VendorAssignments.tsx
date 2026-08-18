import { useEffect, useState } from 'react';
import api from '../../api';
import { MapPin, Phone, Mail, User, ClipboardList, CheckCircle, ChevronDown, ChevronUp, Package, Truck, IndianRupee, AlertCircle } from 'lucide-react';

interface Customer { name?: string; email?: string; phone?: string; }
interface Assignment {
  id: number; serviceType: string; problemDescription: string; status: string;
  userAddress: string; userPhone: string; customer: Customer;
  adminNotes: string | null; createdAt: string; assignedAt: string | null; updatedAt: string;
}
interface MaterialOrder {
  id: number; status: string; quantity: number; unitPrice: number;
  totalAmount: number; advanceAmount: number; remainingAmount: number;
  advancePaid: boolean; remainingPaid: boolean;
  deliveryAddress: string; deliveryCity: string; deliveryPhone: string;
  notes: string | null; createdAt: string; advancePaidAt: string | null;
  buyer: { name: string; email: string; phone: string };
  item: { id: number; title: string; price: number; images: string[]; city: string; unit: string };
}

type Tab = 'services' | 'materials';

const statusStyle = (s: string) => {
  if (s === 'assigned' || s === 'confirmed') return { bg: '#dbeafe', color: '#1e40af' };
  if (s === 'shipped') return { bg: '#fef3c7', color: '#92400e' };
  if (s === 'delivered' || s === 'completed') return { bg: '#d1fae5', color: '#065f46' };
  if (s === 'pending') return { bg: '#f3f4f6', color: '#6b7280' };
  return { bg: '#f3f4f6', color: '#475569' };
};

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function VendorAssignments() {
  const [profile, setProfile] = useState<{ businessName: string; vendorType: string } | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [materialOrders, setMaterialOrders] = useState<MaterialOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('services');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [meRes, listRes] = await Promise.all([api.get('/vendor/me'), api.get('/vendor/assignments')]);
      setProfile(meRes.data);
      setAssignments(listRes.data.assignments || []);
      // Load materials orders if building_materials vendor
      if (meRes.data.vendorType === 'building_materials') {
        try {
          const matRes = await api.get('/purchase/vendor/materials-orders');
          setMaterialOrders(matRes.data.orders || []);
          setTab('materials');
        } catch { setMaterialOrders([]); }
      }
    } catch (e: any) {
      setError(e.response?.status === 403
        ? 'This account is not linked to an active vendor profile.'
        : e.response?.data?.message || 'Could not load vendor portal.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markComplete = async (id: number) => {
    if (!confirm('Mark this job as completed?')) return;
    setActionId(id);
    try { await api.patch(`/vendor/assignments/${id}/complete`); await load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed'); }
    finally { setActionId(null); }
  };

  const markOutForDelivery = async (id: number) => {
    if (!confirm('Mark this order as out for delivery?')) return;
    setActionId(id);
    try { await api.patch(`/purchase/vendor/materials-orders/${id}/out-for-delivery`); await load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed'); }
    finally { setActionId(null); }
  };

  const confirmDelivery = async (id: number) => {
    if (!confirm('Confirm delivery? This will complete the order.')) return;
    setActionId(id);
    try { await api.patch(`/purchase/vendor/materials-orders/${id}/confirm-delivery`); await load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed'); }
    finally { setActionId(null); }
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>Loading…</div>;
  if (error) return (
    <div style={{ padding: 48, maxWidth: 560 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Vendor portal</h1>
      <p style={{ color: '#b45309', background: '#fffbeb', padding: 16, borderRadius: 12, border: '1px solid #fcd34d' }}>{error}</p>
    </div>
  );

  const isMaterialsVendor = profile?.vendorType === 'building_materials';

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {isMaterialsVendor ? 'My Orders & Jobs' : 'My Jobs'}
        </h1>
        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
          {profile?.businessName && <>Signed in as <strong style={{ color: '#334155' }}>{profile.businessName}</strong></>}
        </p>
      </div>

      {/* Tabs — only show if materials vendor */}
      {isMaterialsVendor && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button onClick={() => setTab('materials')} style={{
            padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
            background: tab === 'materials' ? '#0f172a' : '#f1f5f9',
            color: tab === 'materials' ? '#fff' : '#64748b',
            display: 'flex', alignItems: 'center', gap: 7
          }}>
            <Package size={15} /> Materials Orders
            <span style={{ padding: '1px 7px', borderRadius: 10, fontSize: 11, background: tab === 'materials' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', color: tab === 'materials' ? '#fff' : '#64748b' }}>
              {materialOrders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length}
            </span>
          </button>
          <button onClick={() => setTab('services')} style={{
            padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
            background: tab === 'services' ? '#0f172a' : '#f1f5f9',
            color: tab === 'services' ? '#fff' : '#64748b',
            display: 'flex', alignItems: 'center', gap: 7
          }}>
            <ClipboardList size={15} /> Service Jobs
            <span style={{ padding: '1px 7px', borderRadius: 10, fontSize: 11, background: tab === 'services' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', color: tab === 'services' ? '#fff' : '#64748b' }}>
              {assignments.filter(a => a.status === 'assigned').length}
            </span>
          </button>
        </div>
      )}

      {/* ── MATERIALS ORDERS TAB ── */}
      {tab === 'materials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {materialOrders.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <Package size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#334155', marginBottom: 8 }}>No materials orders yet</h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>When admin assigns a materials listing to you and a customer places an order, it will appear here.</p>
            </div>
          ) : materialOrders.map(order => {
            const ss = statusStyle(order.status);
            const open = expanded === order.id;
            return (
              <div key={order.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {/* Header row */}
                <button type="button" onClick={() => setExpanded(open ? null : order.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {order.item?.images?.[0] && (
                      <img src={order.item.images[0]} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{order.item?.title}</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                        Order #{order.id} · Qty: {order.quantity} · {fmt(order.totalAmount)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: ss.bg, color: ss.color, textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                    {open ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                  </div>
                </button>

                {open && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>

                    {/* Payment status */}
                    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ background: order.advancePaid ? '#d1fae5' : '#fef3c7', borderRadius: 10, padding: '12px 14px', border: `1px solid ${order.advancePaid ? '#6ee7b7' : '#fde68a'}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>25% Advance</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: order.advancePaid ? '#065f46' : '#92400e' }}>{fmt(order.advanceAmount)}</div>
                        <div style={{ fontSize: 12, color: order.advancePaid ? '#065f46' : '#92400e', marginTop: 2 }}>
                          {order.advancePaid ? `✅ Paid${order.advancePaidAt ? ' · ' + new Date(order.advancePaidAt).toLocaleDateString('en-IN') : ''}` : '⏳ Awaiting payment'}
                        </div>
                      </div>
                      <div style={{ background: order.remainingPaid ? '#d1fae5' : '#f8fafc', borderRadius: 10, padding: '12px 14px', border: `1px solid ${order.remainingPaid ? '#6ee7b7' : '#e2e8f0'}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>75% On Delivery</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: order.remainingPaid ? '#065f46' : '#334155' }}>{fmt(order.remainingAmount)}</div>
                        <div style={{ fontSize: 12, color: order.remainingPaid ? '#065f46' : '#64748b', marginTop: 2 }}>
                          {order.remainingPaid ? '✅ Paid' : 'Collect at delivery'}
                        </div>
                      </div>
                    </div>

                    {/* Customer details */}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Customer Details</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                        {order.buyer?.name && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                            <User size={15} color="#64748b" />
                            <div><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Name</div><div style={{ fontSize: 13, color: '#334155' }}>{order.buyer.name}</div></div>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                          <Phone size={15} color="#64748b" />
                          <div><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Phone</div>
                            <a href={`tel:${order.deliveryPhone || order.buyer?.phone}`} style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>{order.deliveryPhone || order.buyer?.phone}</a>
                          </div>
                        </div>
                        {order.deliveryAddress && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                            <MapPin size={15} color="#64748b" />
                            <div><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Delivery Address</div><div style={{ fontSize: 13, color: '#334155' }}>{order.deliveryAddress}{order.deliveryCity ? ', ' + order.deliveryCity : ''}</div></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Advance not paid warning */}
                    {!order.advancePaid && (
                      <div style={{ marginTop: 14, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#92400e' }}>
                        <AlertCircle size={16} />
                        Customer hasn't paid the 25% advance yet. Order will be confirmed once advance is paid.
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {order.advancePaid && order.status === 'confirmed' && (
                        <button type="button" disabled={actionId === order.id} onClick={() => markOutForDelivery(order.id)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                          borderRadius: 10, border: 'none', background: actionId === order.id ? '#94a3b8' : '#f59e0b',
                          color: '#fff', fontWeight: 700, fontSize: 14, cursor: actionId === order.id ? 'wait' : 'pointer'
                        }}>
                          <Truck size={16} /> {actionId === order.id ? 'Updating…' : 'Mark Out for Delivery'}
                        </button>
                      )}
                      {order.status === 'shipped' && order.remainingPaid && (
                        <button type="button" disabled={actionId === order.id} onClick={() => confirmDelivery(order.id)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                          borderRadius: 10, border: 'none', background: actionId === order.id ? '#94a3b8' : '#10b981',
                          color: '#fff', fontWeight: 700, fontSize: 14, cursor: actionId === order.id ? 'wait' : 'pointer'
                        }}>
                          <CheckCircle size={16} /> {actionId === order.id ? 'Saving…' : 'Confirm Delivery'}
                        </button>
                      )}
                      {order.status === 'shipped' && !order.remainingPaid && (
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <IndianRupee size={15} /> Waiting for customer to pay remaining {fmt(order.remainingAmount)} on delivery
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── SERVICE JOBS TAB ── */}
      {tab === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {assignments.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <ClipboardList size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#334155', marginBottom: 8 }}>No assignments yet</h2>
              <p style={{ color: '#64748b', fontSize: 14, maxWidth: 420, margin: '0 auto' }}>When admin assigns a service request to you, it will appear here.</p>
            </div>
          ) : assignments.map(a => {
            const open = expanded === a.id;
            const ss = statusStyle(a.status);
            return (
              <div key={a.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <button type="button" onClick={() => setExpanded(open ? null : a.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{a.serviceType}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Request #{a.id}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: ss.bg, color: ss.color, textTransform: 'capitalize' }}>{a.status}</span>
                    {open ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                  </div>
                </button>
                {open && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>Problem</div>
                      <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.55, background: '#fffbeb', padding: 12, borderRadius: 10 }}>{a.problemDescription}</p>
                    </div>
                    {a.adminNotes && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>Admin Notes</div>
                        <p style={{ margin: 0, fontSize: 14, color: '#334155', background: '#eef2ff', padding: 12, borderRadius: 10 }}>{a.adminNotes}</p>
                      </div>
                    )}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Customer</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                          <MapPin size={15} color="#64748b" />
                          <div><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Address</div><div style={{ fontSize: 13, color: '#334155' }}>{a.userAddress}</div></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                          <Phone size={15} color="#64748b" />
                          <div><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Phone</div><div style={{ fontSize: 13, color: '#334155' }}>{a.userPhone}</div></div>
                        </div>
                        {a.customer?.name && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                            <User size={15} color="#64748b" />
                            <div><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Name</div><div style={{ fontSize: 13, color: '#334155' }}>{a.customer.name}</div></div>
                          </div>
                        )}
                        {a.customer?.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                            <Mail size={15} color="#64748b" />
                            <div><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Email</div><div style={{ fontSize: 13, color: '#334155' }}>{a.customer.email}</div></div>
                          </div>
                        )}
                      </div>
                    </div>
                    {a.status === 'assigned' && (
                      <div style={{ marginTop: 16 }}>
                        <button type="button" disabled={actionId === a.id} onClick={() => markComplete(a.id)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                          borderRadius: 10, border: 'none', background: actionId === a.id ? '#94a3b8' : '#10b981',
                          color: '#fff', fontWeight: 700, fontSize: 14, cursor: actionId === a.id ? 'wait' : 'pointer'
                        }}>
                          <CheckCircle size={18} /> {actionId === a.id ? 'Saving…' : 'Mark Completed'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
