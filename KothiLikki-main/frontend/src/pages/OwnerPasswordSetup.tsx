import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

export default function OwnerPasswordSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    if (!token) {
      setError('Invalid or missing token');
      setLoading(false);
      return;
    }

    try {
      console.log('Verifying token:', token);
      const { data } = await api.get(`/account-management/verify-token?token=${token}&type=owner`);
      console.log('Token verification response:', data);
      setValid(data.valid);
      setAccountInfo(data);
    } catch (error: any) {
      console.error('Token verification error:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/account-management/complete-setup', {
        token,
        password,
        type: 'owner'
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/owner/login');
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to set password');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ color: '#fff', fontSize: 18 }}>Verifying...</div>
      </div>
    );
  }

  if (!valid || error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <AlertCircle size={64} color="#ef4444" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
            Invalid or Expired Link
          </h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>
            {error || 'This password setup link is invalid or has expired. Please contact the admin for a new link.'}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#667eea',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
            Password Set Successfully!
          </h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>
            Your account is now active. Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 500, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={40} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
            Set Your Password
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Welcome to INFRAALL Owner Portal
          </p>
        </div>

        {accountInfo && (
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Mail size={16} color="#64748b" />
              <span style={{ fontSize: 14, color: '#475569', fontWeight: 600 }}>Account Email</span>
            </div>
            <div style={{ fontSize: 16, color: '#1e293b', fontWeight: 600 }}>{accountInfo.email}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Use this email as your username to login
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none'
              }}
            />
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Must be at least 6 characters
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: 12,
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              padding: '14px 24px',
              borderRadius: 8,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: 16,
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Setting Password...' : 'Set Password & Activate Account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          After setting your password, you can login at{' '}
          <a href="/owner/login" style={{ color: '#667eea', fontWeight: 600 }}>
            Owner Portal
          </a>
        </div>
      </div>
    </div>
  );
}
