function InstructorDashboard() {
  const courses = [
    { title: 'React for Beginners', students: 120, status: 'Published', revenue: '$240', color: '#6c63ff' },
    { title: 'Node.js Masterclass', students: 85, status: 'Published', revenue: '$170', color: '#48cfad' },
    { title: 'MongoDB Essentials', students: 0, status: 'Pending', revenue: '$0', color: '#f7b731' },
  ];

  return (
    <div style={{ padding: '35px 50px', backgroundColor: '#060d1f', minHeight: '100vh' }}>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1060, #0f2d5e)',
        border: '1px solid rgba(108,99,255,0.3)',
        borderRadius: '20px',
        padding: '35px 40px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-30px', right: '200px',
          width: '200px', height: '200px',
          background: 'rgba(72,207,173,0.1)',
          borderRadius: '50%', filter: 'blur(40px)'
        }} />
        <div>
          <h1 style={{
            fontSize: '30px', fontWeight: '800', marginBottom: '8px',
            background: 'linear-gradient(135deg, #ffffff, #48cfad)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Instructor Dashboard 👨‍🏫
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Manage your courses and track student progress
          </p>
        </div>
        <button style={{
          background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
          color: 'white',
          border: 'none',
          padding: '14px 28px',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '15px',
          boxShadow: '0 8px 25px rgba(108,99,255,0.4)',
          zIndex: 1
        }}>
          + Create Course
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {[
          { icon: '📚', label: 'Total Courses', value: '3', color: '#6c63ff' },
          { icon: '👨‍🎓', label: 'Total Students', value: '205', color: '#48cfad' },
          { icon: '💰', label: 'Total Revenue', value: '$410', color: '#f7b731' },
          { icon: '⭐', label: 'Avg Rating', value: '4.8', color: '#fc5c7d' },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: '1', minWidth: '150px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${stat.color}33`,
            borderRadius: '16px',
            padding: '25px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '50px', height: '50px',
              background: `${stat.color}22`,
              borderRadius: '14px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              margin: '0 auto 12px'
            }}>
              {stat.icon}
            </div>
            <p style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', color: stat.color }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Courses Table */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '25px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0' }}>
            📋 My Courses
          </h2>
          <span style={{
            background: 'rgba(108,99,255,0.2)',
            color: '#a78bfa',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            3 Total
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              background: 'rgba(108,99,255,0.1)',
              borderRadius: '10px'
            }}>
              {['Course Title', 'Students', 'Revenue', 'Status', 'Action'].map((h, i) => (
                <th key={i} style={{
                  padding: '14px 18px',
                  textAlign: 'left',
                  color: '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((course, i) => (
              <tr key={i} style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <td style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '10px', height: '40px',
                    background: course.color,
                    borderRadius: '4px'
                  }} />
                  <span style={{ fontSize: '15px', color: '#e0e6f0', fontWeight: '600' }}>
                    {course.title}
                  </span>
                </td>
                <td style={{ padding: '18px', fontSize: '15px', color: '#94a3b8' }}>
                  👨‍🎓 {course.students}
                </td>
                <td style={{ padding: '18px', fontSize: '15px', color: '#94a3b8' }}>
                  {course.revenue}
                </td>
                <td style={{ padding: '18px' }}>
                  <span style={{
                    background: course.status === 'Published'
                      ? 'rgba(72,207,173,0.15)' : 'rgba(247,183,49,0.15)',
                    color: course.status === 'Published' ? '#48cfad' : '#f7b731',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}>
                    {course.status === 'Published' ? '✅' : '⏳'} {course.status}
                  </span>
                </td>
                <td style={{ padding: '18px' }}>
                  <button style={{
                    background: 'rgba(108,99,255,0.15)',
                    border: '1px solid rgba(108,99,255,0.3)',
                    color: '#a78bfa',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    Edit →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
          📈 Enrollment Analytics
        </h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', height: '120px' }}>
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '100%',
                height: `${h}%`,
                background: 'linear-gradient(180deg, #6c63ff, #48cfad)',
                borderRadius: '6px 6px 0 0',
                boxShadow: '0 0 15px rgba(108,99,255,0.3)'
              }} />
              <span style={{ fontSize: '11px', color: '#475569' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default InstructorDashboard;