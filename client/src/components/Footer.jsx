function Footer() {
  return (
    <footer style={{
      background: 'rgba(255,255,255,0.02)',
      borderTop: '1px solid rgba(108,99,255,0.2)',
      padding: '50px 60px 30px',
      marginTop: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '40px' }}>

        {/* Brand */}
        <div>
          <p style={{
            fontSize: '22px', fontWeight: '800', marginBottom: '12px',
            background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            📚 Aarivya Learn
          </p>
          <p style={{ color: '#475569', fontSize: '14px', maxWidth: '250px', lineHeight: '1.7' }}>
            AI-Powered Smart E-Learning Platform by Aarivya Labs & H & P Projects
          </p>
        </div>

        {/* Links */}
        {[
          { title: 'Platform', links: ['Courses', 'Live Sessions', 'Certificates', 'AI Features'] },
          { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
          { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Use', 'FAQ'] },
        ].map((col, i) => (
          <div key={i}>
            <p style={{ color: '#e0e6f0', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>
              {col.title}
            </p>
            {col.links.map((link, j) => (
              <p key={j} style={{ color: '#475569', fontSize: '14px', marginBottom: '10px', cursor: 'pointer' }}>
                {link}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <p style={{ color: '#334155', fontSize: '13px' }}>
          © 2026 Aarivya Labs | H & P Projects. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['🎓 1000+ Courses', '👨‍🎓 5000+ Students', '👨‍🏫 200+ Instructors'].map((stat, i) => (
            <span key={i} style={{ fontSize: '13px', color: '#334155' }}>{stat}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;