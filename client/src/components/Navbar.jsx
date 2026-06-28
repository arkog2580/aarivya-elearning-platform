import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      background: 'rgba(6, 13, 31, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '16px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(108, 99, 255, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>

      {/* Logo */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none'
      }}>
        {/* 3D Book Icon */}
        <div style={{
          width: '42px', height: '42px',
          background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(108,99,255,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
          transform: 'perspective(100px) rotateX(5deg)',
          position: 'relative'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4C4 2.9 4.9 2 6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4Z" fill="rgba(255,255,255,0.2)"/>
            <path d="M8 6H16M8 10H16M8 14H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 2V22" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          </svg>
        </div>
        <div>
          <span style={{
            fontSize: '20px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            Aarivya
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #a78bfa, #48cfad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            {' '}Learn
          </span>
        </div>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#a0aec0', fontSize: '15px', fontWeight: '500' }}>Home</Link>
        <Link to="/student" style={{ color: '#a0aec0', fontSize: '15px', fontWeight: '500' }}>Courses</Link>
        <Link to="/login" style={{
          color: '#e0e6f0', fontSize: '15px', fontWeight: '600',
          border: '1px solid rgba(108,99,255,0.5)',
          padding: '8px 22px', borderRadius: '8px',
        }}>
          Login
        </Link>
        <Link to="/register" style={{
          background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
          color: 'white', fontSize: '15px', fontWeight: '600',
          padding: '8px 22px', borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(108,99,255,0.4)',
        }}>
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;