import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required';
    else if (name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleRegister = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/student');
    }, 1500);
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${errors[field] ? '#fc5c7d' : 'rgba(108,99,255,0.3)'}`,
    borderRadius: '12px',
    color: '#e0e6f0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    display: 'block', marginBottom: '8px',
    color: '#94a3b8', fontSize: '13px', fontWeight: '600',
    letterSpacing: '0.5px', textTransform: 'uppercase'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1a1060 0%, #060d1f 70%)',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Glow Effects */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: '350px', height: '350px',
        background: 'rgba(108,99,255,0.12)',
        borderRadius: '50%', filter: 'blur(90px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%',
        width: '300px', height: '300px',
        background: 'rgba(72,207,173,0.08)',
        borderRadius: '50%', filter: 'blur(90px)'
      }} />

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(108,99,255,0.25)',
        borderRadius: '24px',
        padding: '50px 45px',
        width: '100%',
        maxWidth: '440px',
        zIndex: 1,
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{
            width: '70px', height: '70px',
            background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 25px rgba(108,99,255,0.4)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="5" stroke="white" strokeWidth="2"/>
              <path d="M8 15l-2 7 6-3 6 3-2-7" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M10 10l1.5 1.5L14 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: '30px', fontWeight: '800', marginBottom: '8px',
            background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Create Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Join thousands of learners today
          </p>
        </div>

        {/* Name */}
        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors({...errors, name: ''}); }}
            style={inputStyle('name')}
          />
          {errors.name && (
            <p style={{ color: '#fc5c7d', fontSize: '12px', marginTop: '6px' }}>
              ⚠️ {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
            style={inputStyle('email')}
          />
          {errors.email && (
            <p style={{ color: '#fc5c7d', fontSize: '12px', marginTop: '6px' }}>
              ⚠️ {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
            style={inputStyle('password')}
          />
          {errors.password && (
            <p style={{ color: '#fc5c7d', fontSize: '12px', marginTop: '6px' }}>
              ⚠️ {errors.password}
            </p>
          )}
        </div>

        {/* Role */}
        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>I am a...</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { value: 'student', label: '🎓 Student' },
              { value: 'instructor', label: '👨‍🏫 Instructor' }
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                style={{
                  flex: 1, padding: '12px',
                  borderRadius: '12px',
                  border: role === r.value
                    ? '2px solid #6c63ff'
                    : '1px solid rgba(255,255,255,0.1)',
                  background: role === r.value
                    ? 'rgba(108,99,255,0.2)'
                    : 'rgba(255,255,255,0.03)',
                  color: role === r.value ? '#a78bfa' : '#64748b',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%', padding: '15px',
            background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6c63ff, #48cfad)',
            color: 'white', border: 'none',
            borderRadius: '12px', fontSize: '16px', fontWeight: '700',
            boxShadow: '0 8px 25px rgba(108,99,255,0.4)',
            marginBottom: '20px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Creating Account...' : 'Create Account 🎉'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: '#475569', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google */}
        <button style={{
          width: '100%', padding: '14px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', color: '#e0e6f0',
          fontSize: '15px', fontWeight: '600', marginBottom: '25px'
        }}>
          🌐 Continue with Google
        </button>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a78bfa', fontWeight: '700' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;