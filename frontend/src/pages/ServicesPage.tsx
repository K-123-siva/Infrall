import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, CheckCircle, CreditCard, Crown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api';

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}


const serviceItems = [
  { name: 'Home Cleaning', icon: '🧹', desc: 'Professional cleaning' },
  { name: 'Maid Service',  icon: '🧺', desc: 'Daily / part-time maid' },
  { name: 'Plumbing',      icon: '🔧', desc: 'Pipe & fixture repair' },
  { name: 'Electrical',    icon: '⚡', desc: 'Wiring & repairs' },
  { name: 'Painting',      icon: '🎨', desc: 'Interior & exterior' },
  { name: 'Carpentry',     icon: '🪚', desc: 'Wood work' },
  { name: 'AC Repair',     icon: '❄️', desc: 'AC service & repair' },
  { name: 'Pest Control',  icon: '🐛', desc: 'Pest management' },
  { name: 'Appliance Repair', icon: '🔨', desc: 'Fix appliances' },
  { name: 'Gardening',     icon: '🌱', desc: 'Garden maintenance' },
  { name: 'Moving & Packing', icon: '📦', desc: 'Relocation services' },
  { name: 'Interior Design',  icon: '🏠', desc: 'Design consultation' },
  { name: 'Other',         icon: '🛠️', desc: 'Other services' }
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [selectedService, setSelectedService] = useState('Home Cleaning');
  const [problemDescription, setProblemDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Subscription state
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<'weekly' | 'monthly' | 'yearly' | null>(null);

  // Load Razorpay script
  useEffect(() => {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Check subscription on mount
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setCheckingSubscription(false);
      setHasSubscription(false);
      setSubscription(null);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      setCheckingSubscription(true);
      const { data } = await api.get('/payment/active-subscription');
      
      // Check if user has home services subscription
      if (data.hasActiveSubscription && data.subscription) {
        const sub = data.subscription;
        const isHomeServicesSubscription = ['home_services_weekly', 'home_services_monthly', 'home_services_yearly'].includes(sub.packageType);
        
        if (isHomeServicesSubscription) {
          setHasSubscription(true);
          setSubscription(sub);
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login first to request a service');
      navigate('/login');
      return;
    }

    if (!selectedService || !problemDescription.trim() || !address.trim() || !phone.trim()) {
      setErrorMessage('Please fill in all required fields');
      setSubmitStatus('error');
      return;
    }

    // If user has subscription, submit directly
    if (hasSubscription) {
      await submitServiceRequest();
    } else {
      // Reset selected plan and show payment options
      setSelectedSubscriptionPlan(null);
      setShowPaymentOptions(true);
    }
  };

  const submitServiceRequest = async (razorpayOrderId?: string, razorpayPaymentId?: string) => {
    setLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await api.post('/service-requests/create', {
        serviceType: selectedService,
        problemDescription,
        userAddress: address,
        userPhone: phone,
        razorpayOrderId,
        razorpayPaymentId
      });

      setSubmitStatus('success');
      setSelectedService('Home Cleaning');
      setProblemDescription('');
      setAddress('');
      setPhone(user?.phone || '');
      setShowPaymentOptions(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error: any) {
      if (error.response?.data?.requiresPayment) {
        setErrorMessage('Payment is required for this service request');
        setShowPaymentOptions(true);
      } else {
        setErrorMessage(error.response?.data?.message || 'Failed to submit service request');
      }
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionPayment = async (planType: 'weekly' | 'monthly' | 'yearly') => {
    try {
      setLoading(true);
      
      const packageTypeMap = {
        'weekly': 'home_services_weekly',
        'monthly': 'home_services_monthly', 
        'yearly': 'home_services_yearly'
      };

      // Create Razorpay order for subscription
      const { data } = await api.post('/payment/create-order', {
        packageType: packageTypeMap[planType]
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'INFRAALL Home Services',
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            // Verify subscription payment
            const verifyResponse = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              packageType: packageTypeMap[planType]
            });

            if (verifyResponse.data.success) {
              // Subscription created successfully, now submit the service request for FREE
              await submitServiceRequest();
              setShowPaymentOptions(false);
              // Refresh subscription status
              checkSubscription();
            }
          } catch (error) {
            console.error('Subscription payment verification failed:', error);
            setErrorMessage('Subscription payment verification failed. Please try again.');
            setSubmitStatus('error');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: phone
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setErrorMessage('Payment cancelled');
            setSubmitStatus('error');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Subscription payment initiation failed:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to initiate subscription payment');
      setSubmitStatus('error');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const { data } = await api.post('/payment/create-order', {
        packageType: 'home_services_one_time'
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'INFRAALL Home Services',
        description: `${selectedService} Service Request`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              packageType: 'home_services_one_time'
            });

            if (verifyResponse.data.success) {
              // Submit service request with payment details
              await submitServiceRequest(response.razorpay_order_id, response.razorpay_payment_id);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setErrorMessage('Payment verification failed. Please try again.');
            setSubmitStatus('error');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: phone
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setErrorMessage('Payment cancelled');
            setSubmitStatus('error');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to initiate payment');
      setSubmitStatus('error');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fff7ed 100%)', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Request Home Services</h1>
          <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Tell us what service you need and we'll connect you with the best professionals</p>
          
          {/* Subscription Status Badge */}
          {!checkingSubscription && (
            <div style={{ marginTop: 20 }}>
              {hasSubscription ? (
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  padding: '10px 20px', 
                  background: 'linear-gradient(135deg, #10b981, #059669)', 
                  borderRadius: 30, 
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)' 
                }}>
                  <Crown size={18} color="#fff" />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                    Active Subscription - Unlimited FREE Requests
                  </span>
                </div>
              ) : (
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  padding: '10px 20px', 
                  background: '#fef3c7', 
                  borderRadius: 30, 
                  border: '1.5px solid #fbbf24' 
                }}>
                  <AlertCircle size={16} color="#92400e" />
                  <span style={{ color: '#92400e', fontWeight: 600, fontSize: 13 }}>
                    No subscription - ₹149 per request
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Card */}
        <div style={{ background: '#ffffff', borderRadius: 20, boxShadow: '0 16px 48px rgba(0,0,0,0.08)', padding: '40px', border: '1px solid #f1f5f9' }}>
          
          <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#d1fae5', borderRadius: 12, border: '1px solid #6ee7b7' }}>
                <CheckCircle size={20} color="#059669" />
                <div>
                  <div style={{ fontWeight: 700, color: '#065f46', fontSize: 14 }}>Request Submitted!</div>
                  <p style={{ fontSize: 13, color: '#047857', margin: '4px 0 0 0' }}>Our team will review your request and assign a worker soon.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#fee2e2', borderRadius: 12, border: '1px solid #fca5a5' }}>
                <AlertCircle size={20} color="#dc2626" />
                <div>
                  <div style={{ fontWeight: 700, color: '#991b1b', fontSize: 14 }}>Error</div>
                  <p style={{ fontSize: 13, color: '#7f1d1d', margin: '4px 0 0 0' }}>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Service Type Selection */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
                Select Service Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                {serviceItems.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setSelectedService(item.name)}
                    style={{
                      cursor: 'pointer',
                      padding: '16px 12px',
                      background: selectedService === item.name ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#f8fafc',
                      borderRadius: 12,
                      border: selectedService === item.name ? '2px solid #f97316' : '1.5px solid #e2e8f0',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      color: selectedService === item.name ? '#fff' : '#1e293b',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                Describe Your Problem *
              </label>
              <textarea
                value={problemDescription}
                onChange={e => setProblemDescription(e.target.value)}
                placeholder="Tell us what needs to be fixed or improved. The more details, the better we can help you."
                style={{
                  width: '100%',
                  minHeight: 120,
                  padding: '14px 16px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: '#1f2937',
                  outline: 'none',
                  background: '#f8fafc',
                  resize: 'vertical'
                }}
              />
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{problemDescription.length}/500 characters</p>
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                Service Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter address where service is needed..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#1f2937',
                  outline: 'none',
                  background: '#f8fafc',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                Contact Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10-digit phone number"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#1f2937',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#cbd5e1' : hasSubscription ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: loading ? 'none' : hasSubscription ? '0 6px 16px rgba(16,185,129,0.3)' : '0 6px 16px rgba(249,115,22,0.3)',
                transition: 'all 0.2s'
              }}
            >
              {hasSubscription ? <Crown size={18} /> : <Send size={18} />}
              {loading ? 'Submitting...' : hasSubscription ? 'Submit Request (FREE)' : 'Continue to Payment'}
            </button>

            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', margin: 0 }}>
              {hasSubscription 
                ? 'Your subscription covers unlimited service requests'
                : 'Choose subscription or one-time payment on next step'
              }
            </p>
          </form>
        </div>

        {/* Payment Options Modal */}
        {showPaymentOptions && (
          <div 
            onClick={() => setShowPaymentOptions(false)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.6)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 24, 
              zIndex: 1000 
            }}
          >
            <div 
              onClick={e => e.stopPropagation()}
              style={{ 
                background: '#fff', 
                borderRadius: 20, 
                maxWidth: 600, 
                width: '100%', 
                maxHeight: '90vh', 
                overflow: 'auto', 
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)' 
              }}
            >
              {/* Modal Header */}
              <div style={{ 
                background: 'linear-gradient(135deg, #f97316, #ea580c)', 
                padding: '24px 32px', 
                borderRadius: '20px 20px 0 0' 
              }}>
                <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}>
                  Choose Payment Option
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, margin: '8px 0 0' }}>
                  Select how you'd like to pay for home services
                </p>
              </div>

              {/* Modal Content */}
              <div style={{ padding: 32 }}>
                
                {/* Option 1: Subscribe */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)', 
                  border: '2px solid #fbbf24', 
                  borderRadius: 16, 
                  padding: 24, 
                  marginBottom: 20 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Crown size={24} color="#92400e" />
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#92400e', margin: 0 }}>
                      Subscribe & Save
                    </h3>
                    <span style={{ 
                      padding: '4px 12px', 
                      background: '#10b981', 
                      color: '#fff', 
                      borderRadius: 20, 
                      fontSize: 11, 
                      fontWeight: 700 
                    }}>
                      RECOMMENDED
                    </span>
                  </div>
                  
                  <p style={{ fontSize: 14, color: '#78350f', marginBottom: 20 }}>
                    Get unlimited service requests with a subscription
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    <div 
                      onClick={() => setSelectedSubscriptionPlan('weekly')}
                      style={{ 
                        background: selectedSubscriptionPlan === 'weekly' ? '#e0f2fe' : '#fff', 
                        padding: '16px 20px', 
                        borderRadius: 12, 
                        border: selectedSubscriptionPlan === 'weekly' ? '2px solid #0ea5e9' : '1.5px solid #fbbf24',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 16 }}>Weekly Plan</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Unlimited requests for 7 days</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#f97316' }}>₹299</div>
                    </div>

                    <div 
                      onClick={() => setSelectedSubscriptionPlan('monthly')}
                      style={{ 
                        background: selectedSubscriptionPlan === 'monthly' ? '#ecfdf5' : '#fff', 
                        padding: '16px 20px', 
                        borderRadius: 12, 
                        border: selectedSubscriptionPlan === 'monthly' ? '2px solid #10b981' : '2px solid #10b981',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 16 }}>
                          Monthly Plan
                          <span style={{ 
                            marginLeft: 8, 
                            padding: '2px 8px', 
                            background: '#10b981', 
                            color: '#fff', 
                            borderRadius: 10, 
                            fontSize: 10, 
                            fontWeight: 700 
                          }}>
                            POPULAR
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Unlimited requests for 30 days</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>₹499</div>
                    </div>

                    <div 
                      onClick={() => setSelectedSubscriptionPlan('yearly')}
                      style={{ 
                        background: selectedSubscriptionPlan === 'yearly' ? '#f0f9ff' : '#fff', 
                        padding: '16px 20px', 
                        borderRadius: 12, 
                        border: selectedSubscriptionPlan === 'yearly' ? '2px solid #6366f1' : '1.5px solid #fbbf24',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 16 }}>
                          Yearly Plan
                          <span style={{ 
                            marginLeft: 8, 
                            padding: '2px 8px', 
                            background: '#6366f1', 
                            color: '#fff', 
                            borderRadius: 10, 
                            fontSize: 10, 
                            fontWeight: 700 
                          }}>
                            BEST VALUE
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Unlimited requests for 365 days</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#6366f1' }}>₹699</div>
                    </div>
                  </div>

                  <button
                    onClick={() => selectedSubscriptionPlan && handleSubscriptionPayment(selectedSubscriptionPlan)}
                    disabled={!selectedSubscriptionPlan || loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: !selectedSubscriptionPlan || loading ? '#cbd5e1' : 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: !selectedSubscriptionPlan || loading ? 'not-allowed' : 'pointer',
                      boxShadow: !selectedSubscriptionPlan || loading ? 'none' : '0 4px 12px rgba(16,185,129,0.3)'
                    }}
                  >
                    {loading ? 'Processing...' : selectedSubscriptionPlan ? `Subscribe ${selectedSubscriptionPlan.charAt(0).toUpperCase() + selectedSubscriptionPlan.slice(1)}` : 'Select a Plan'}
                  </button>
                </div>

                {/* Option 2: One-Time Payment */}
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1.5px solid #e2e8f0', 
                  borderRadius: 16, 
                  padding: 24 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <CreditCard size={24} color="#64748b" />
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                      One-Time Payment
                    </h3>
                  </div>
                  
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>
                    Pay only for this service request
                  </p>

                  <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: 12, 
                    border: '1.5px solid #e2e8f0',
                    marginBottom: 20,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Amount to pay</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: '#f97316' }}>₹149</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>For this request only</div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 'none' : '0 4px 12px rgba(249,115,22,0.3)'
                    }}
                  >
                    {loading ? 'Processing...' : 'Pay ₹149 & Submit Request'}
                  </button>
                  
                  <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 12, margin: 0 }}>
                    Secure payment powered by Razorpay
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 16
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
