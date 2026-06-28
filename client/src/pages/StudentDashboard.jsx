function StudentDashboard() {
  const courses = [
    { title: 'React for Beginners', progress: 75, instructor: 'John Doe', color: '#6c63ff' },
    { title: 'Node.js Masterclass', progress: 45, instructor: 'Jane Smith', color: '#48cfad' },
    { title: 'MongoDB Essentials', progress: 20, instructor: 'Bob Wilson', color: '#f7b731' },
  ];

  const recommended = [
    { title: 'Advanced JavaScript', category: 'Programming', color: '#6c63ff', students: '3.2k' },
    { title: 'UI/UX Design Basics', category: 'Design', color: '#fc5c7d', students: '1.8k' },
    { title: 'Python for Data Science', category: 'AI/ML', color: '#48cfad', students: '4.1k' },
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
          Welcome back, Arko! 👋
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          You have 3 courses in progress. Keep it up! 💪
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {[
          { icon: '📚', label: 'Enrolled', value: '3', color: '#6c63ff' },
          { icon: '✅', label: 'Completed', value: '1', color: '#48cfad' },
          { icon: '🏆', label: 'Certificates', value: '1', color: '#f7b731' },
          { icon: '⏱️', label: 'Hours Learned', value: '24', color: '#fc5c7d' },
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
            <p style={{
              fontSize: '32px', fontWeight: '800', marginBottom: '4px',
              color: stat.color
            }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>

        {/* My Courses */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2 style={{
            fontSize: '20px', fontWeight: '700', marginBottom: '18px',
            color: '#e0e6f0', display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            📖 My Courses
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {courses.map((course, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '22px',
                borderLeft: `4px solid ${course.color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#e0e6f0' }}>
                    {course.title}
                  </h3>
                  <span style={{
                    fontSize: '14px', fontWeight: '800', color: course.color
                  }}>
                    {course.progress}%
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
                  👨‍🏫 {course.instructor}
                </p>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px', height: '8px'
                }}>
                  <div style={{
                    background: `linear-gradient(90deg, ${course.color}, ${course.color}88)`,
                    width: `${course.progress}%`,
                    height: '8px', borderRadius: '10px',
                    boxShadow: `0 0 10px ${course.color}66`
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h2 style={{
            fontSize: '20px', fontWeight: '700', marginBottom: '18px',
            color: '#e0e6f0'
          }}>
            🤖 Recommended
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recommended.map((course, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '20px',
              }}>
                <span style={{
                  background: `${course.color}22`,
                  color: course.color,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {course.category}
                </span>
                <h3 style={{
                  fontSize: '15px', fontWeight: '700',
                  color: '#e0e6f0', margin: '12px 0 6px'
                }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
                  👨‍🎓 {course.students} students
                </p>
                <button style={{
                  width: '100%',
                  padding: '10px',
                  background: `linear-gradient(135deg, ${course.color}44, ${course.color}22)`,
                  border: `1px solid ${course.color}44`,
                  color: course.color,
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  Enroll Now →
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;