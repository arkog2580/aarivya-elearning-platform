function AdminDashboard() {
  const users = [
    { name: 'Arko Das', email: 'arko@gmail.com', role: 'Student', status: 'Active' },
    { name: 'John Doe', email: 'john@gmail.com', role: 'Instructor', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@gmail.com', role: 'Instructor', status: 'Pending' },
  ];

  const pendingCourses = [
    { title: 'MongoDB Essentials', instructor: 'Jane Smith', category: 'Database' },
    { title: 'Docker for Beginners', instructor: 'Bob Wilson', category: 'DevOps' },
  ];

  const roleColor = { Student: '#6c63ff', Instructor: '#48cfad', Admin: '#f7b731' };
  const statusColor = { Active: '#48cfad', Pending: '#f7b731', Banned: '#fc5c7d' };

  return (
    <div style={{ padding: '35px 50px', backgroundColor: '#060d1f', minHeight: '100vh' }}>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1060, #0f2d5e)',
        border: '1px solid rgba(108,99,255,0.3)',
        borderRadius: '20px',
        padding: '35px 40px',
        marginBottom: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '200px', height: '200px',
          background: 'rgba(108,99,255,0.15)',
          borderRadius: '50%', filter: 'blur(40px)'
        }} />
        <h1 style={{
          fontSize: '30px', fontWeight: '800', marginBottom: '8px',
          background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Admin Panel ⚙️
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Manage users, courses, and platform settings
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {[
          { icon: '👥', label: 'Total Users', value: '5,240', color: '#6c63ff' },
          { icon: '📚', label: 'Total Courses', value: '1,020', color: '#48cfad' },
          { icon: '💰', label: 'Total Revenue', value: '$52K', color: '#f7b731' },
          { icon: '📈', label: 'Monthly Active', value: '3,100', color: '#fc5c7d' },
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

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>

        {/* Users Table */}
        <div style={{
          flex: '2', minWidth: '300px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '30px'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '25px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0' }}>
              👥 User Management
            </h2>
            <button style={{
              background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
              color: 'white', border: 'none',
              padding: '8px 18px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600'
            }}>
              + Add User
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(108,99,255,0.1)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Action'].map((h, i) => (
                  <th key={i} style={{
                    padding: '12px 16px', textAlign: 'left',
                    color: '#94a3b8', fontSize: '12px',
                    fontWeight: '600', textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px',
                        background: `${roleColor[user.role]}33`,
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}>
                        {user.role === 'Student' ? '🎓' : '👨‍🏫'}
                      </div>
                      <span style={{ fontSize: '14px', color: '#e0e6f0', fontWeight: '600' }}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      background: `${roleColor[user.role]}22`,
                      color: roleColor[user.role],
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      background: `${statusColor[user.status]}22`,
                      color: statusColor[user.status],
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{
                      background: 'rgba(252,92,125,0.15)',
                      border: '1px solid rgba(252,92,125,0.3)',
                      color: '#fc5c7d', padding: '6px 14px',
                      borderRadius: '8px', fontSize: '12px', fontWeight: '600'
                    }}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Courses */}
        <div style={{
          flex: '1', minWidth: '250px',
          display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px', padding: '25px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
              ⏳ Pending Approvals
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {pendingCourses.map((course, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px', padding: '18px'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#e0e6f0', marginBottom: '6px' }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                    By {course.instructor}
                  </p>
                  <span style={{
                    background: 'rgba(108,99,255,0.15)',
                    color: '#a78bfa', padding: '3px 10px',
                    borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                  }}>
                    {course.category}
                  </span>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button style={{
                      flex: 1, padding: '9px',
                      background: 'linear-gradient(135deg, #48cfad33, #48cfad11)',
                      border: '1px solid #48cfad44',
                      color: '#48cfad', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '700'
                    }}>
                      ✅ Approve
                    </button>
                    <button style={{
                      flex: 1, padding: '9px',
                      background: 'rgba(252,92,125,0.1)',
                      border: '1px solid rgba(252,92,125,0.3)',
                      color: '#fc5c7d', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '700'
                    }}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px', padding: '25px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
              🌐 Platform Health
            </h2>
            {[
              { label: 'Server Uptime', value: '99.9%', color: '#48cfad' },
              { label: 'API Response', value: '120ms', color: '#6c63ff' },
              { label: 'Storage Used', value: '67%', color: '#f7b731' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: item.color }}>{item.value}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', height: '6px' }}>
                  <div style={{
                    background: item.color,
                    width: item.value,
                    height: '6px', borderRadius: '10px',
                    boxShadow: `0 0 8px ${item.color}66`
                  }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;