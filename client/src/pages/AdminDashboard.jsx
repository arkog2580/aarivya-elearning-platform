import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAllUsers, getPendingCourses, approveCourse, rejectCourse } from '../api';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, usersRes, pendingRes] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getPendingCourses()
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setPendingCourses(pendingRes.data.courses || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveCourse(id);
      setActionMsg('Course approved successfully!');
      fetchAllData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (error) {
      console.error('Error approving course:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCourse(id);
      setActionMsg('Course rejected!');
      fetchAllData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (error) {
      console.error('Error rejecting course:', error);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const roleColor = { student: '#6c63ff', instructor: '#48cfad', admin: '#f7b731' };
  const tabs = ['overview', 'users', 'courses', 'platform'];

  if (loading) return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#060d1f',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '60px', height: '60px',
          border: '3px solid rgba(108,99,255,0.3)',
          borderTop: '3px solid #6c63ff',
          borderRadius: '50%', margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#64748b' }}>Loading admin panel...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#060d1f', minHeight: '100vh' }}>

      {/* Top Bar */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 50px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px', fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Admin Panel ⚙️
          </h1>
          <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>
            Welcome, {user?.name}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(252,92,125,0.15)',
            border: '1px solid rgba(252,92,125,0.3)',
            color: '#fc5c7d', padding: '10px 20px',
            borderRadius: '10px', fontSize: '14px', fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: '30px 50px' }}>

        {/* Action Message */}
        {actionMsg && (
          <div style={{
            background: 'rgba(72,207,173,0.1)',
            border: '1px solid rgba(72,207,173,0.3)',
            borderRadius: '12px', padding: '15px 20px',
            color: '#48cfad', marginBottom: '20px',
            fontSize: '15px', fontWeight: '600'
          }}>
            ✅ {actionMsg}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '30px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '6px'
        }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              background: activeTab === tab
                ? 'linear-gradient(135deg, #6c63ff, #48cfad)'
                : 'transparent',
              color: activeTab === tab ? 'white' : '#64748b',
              fontSize: '14px', fontWeight: '700',
              textTransform: 'capitalize', cursor: 'pointer'
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div>
            {/* Stats Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px', marginBottom: '30px'
            }}>
              {[
                { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: '#6c63ff' },
                { icon: '🎓', label: 'Students', value: stats.totalStudents, color: '#48cfad' },
                { icon: '👨‍🏫', label: 'Instructors', value: stats.totalInstructors, color: '#f7b731' },
                { icon: '📚', label: 'Total Courses', value: stats.totalCourses, color: '#fc5c7d' },
                { icon: '✅', label: 'Published', value: stats.publishedCourses, color: '#48cfad' },
                { icon: '⏳', label: 'Pending', value: stats.pendingCourses, color: '#f7b731' },
                { icon: '📖', label: 'Enrollments', value: stats.totalEnrollments, color: '#6c63ff' },
                { icon: '🏆', label: 'Completions', value: stats.completedCourses, color: '#fc5c7d' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${stat.color}33`,
                  borderRadius: '16px', padding: '20px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</p>
                  <p style={{ fontSize: '28px', fontWeight: '900', color: stat.color, marginBottom: '4px' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pending Approvals */}
            {pendingCourses.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(247,183,49,0.2)',
                borderRadius: '20px', padding: '30px'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
                  ⏳ Pending Course Approvals ({pendingCourses.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {pendingCourses.map((course, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px', padding: '20px',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexWrap: 'wrap', gap: '15px'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#e0e6f0', marginBottom: '4px' }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#475569' }}>
                          By {course.instructorId?.name} • {course.category}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleApprove(course._id)}
                          style={{
                            padding: '8px 20px',
                            background: 'rgba(72,207,173,0.15)',
                            border: '1px solid rgba(72,207,173,0.3)',
                            color: '#48cfad', borderRadius: '8px',
                            fontSize: '13px', fontWeight: '700'
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(course._id)}
                          style={{
                            padding: '8px 20px',
                            background: 'rgba(252,92,125,0.15)',
                            border: '1px solid rgba(252,92,125,0.3)',
                            color: '#fc5c7d', borderRadius: '8px',
                            fontSize: '13px', fontWeight: '700'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px', padding: '30px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
              👥 All Users ({users.length})
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(108,99,255,0.1)' }}>
                  {['User', 'Email', 'Role', 'Joined'].map((h, i) => (
                    <th key={i} style={{
                      padding: '12px 16px', textAlign: 'left',
                      color: '#94a3b8', fontSize: '12px',
                      fontWeight: '600', textTransform: 'uppercase'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px',
                          background: `${roleColor[u.role]}33`,
                          borderRadius: '10px',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                          color: roleColor[u.role],
                          fontWeight: '800', fontSize: '16px'
                        }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '15px', color: '#e0e6f0', fontWeight: '600' }}>
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        background: `${roleColor[u.role]}22`,
                        color: roleColor[u.role],
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: '700',
                        textTransform: 'capitalize'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#475569' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px', padding: '30px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
              ⏳ Pending Course Approvals
            </h2>
            {pendingCourses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '40px', marginBottom: '15px' }}>✅</p>
                <p style={{ color: '#64748b', fontSize: '16px' }}>
                  No pending courses! All caught up.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pendingCourses.map((course, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(247,183,49,0.2)',
                    borderRadius: '14px', padding: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#e0e6f0', marginBottom: '4px' }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                          By {course.instructorId?.name} • {course.category} • {course.level}
                        </p>
                        <p style={{ fontSize: '13px', color: '#475569' }}>
                          {course.description?.substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button
                        onClick={() => handleApprove(course._id)}
                        style={{
                          padding: '10px 24px',
                          background: 'linear-gradient(135deg, #48cfad33, #48cfad11)',
                          border: '1px solid #48cfad44',
                          color: '#48cfad', borderRadius: '8px',
                          fontSize: '14px', fontWeight: '700'
                        }}
                      >
                        ✅ Approve Course
                      </button>
                      <button
                        onClick={() => handleReject(course._id)}
                        style={{
                          padding: '10px 24px',
                          background: 'rgba(252,92,125,0.1)',
                          border: '1px solid rgba(252,92,125,0.3)',
                          color: '#fc5c7d', borderRadius: '8px',
                          fontSize: '14px', fontWeight: '700'
                        }}
                      >
                        ❌ Reject Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PLATFORM TAB */}
        {activeTab === 'platform' && stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '30px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '25px' }}>
                🌐 Platform Health
              </h2>
              {[
                { label: 'User Growth', value: stats.totalUsers, max: 100, color: '#6c63ff' },
                { label: 'Course Completion Rate', value: stats.totalEnrollments > 0 ? Math.round((stats.completedCourses / stats.totalEnrollments) * 100) : 0, max: 100, color: '#48cfad', suffix: '%' },
                { label: 'Published Courses', value: stats.totalCourses > 0 ? Math.round((stats.publishedCourses / stats.totalCourses) * 100) : 0, max: 100, color: '#f7b731', suffix: '%' },
                { label: 'Total Enrollments', value: stats.totalEnrollments, max: 100, color: '#fc5c7d' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '600' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: item.color }}>
                      {item.value}{item.suffix || ''}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', height: '8px' }}>
                    <div style={{
                      background: item.color,
                      width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                      height: '8px', borderRadius: '10px',
                      boxShadow: `0 0 10px ${item.color}66`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;