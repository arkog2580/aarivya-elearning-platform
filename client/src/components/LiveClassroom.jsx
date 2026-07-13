import { useState } from 'react';

function LiveClassroom({ user, socket, enrolledCourses }) {
  const [isLive, setIsLive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [participants, setParticipants] = useState([]);

  const handleStartSession = () => {
    if (!selectedCourse) return;
    setIsLive(true);
    socket?.emit('start_live_session', {
      courseId: selectedCourse,
      instructor: { id: user._id, name: user.name }
    });
  };

  const handleEndSession = () => {
    setIsLive(false);
    socket?.emit('end_live_session', { courseId: selectedCourse });
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '20px', padding: '30px'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
        🎥 Virtual Classroom
      </h2>

      {!isLive ? (
        <div>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Start a live session for your students. They will be notified instantly!
          </p>

          {/* Course Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(108,99,255,0.3)',
                borderRadius: '10px', color: '#e0e6f0',
                fontSize: '14px', outline: 'none'
              }}
            >
              <option value="">Choose a course...</option>
              {enrolledCourses?.map((course, i) => (
                <option key={i} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Features */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px', marginBottom: '25px'
          }}>
            {[
              { icon: '🎤', label: 'Voice Chat' },
              { icon: '📹', label: 'Video Stream' },
              { icon: '🖥️', label: 'Screen Share' },
              { icon: '💬', label: 'Live Chat' },
              { icon: '✋', label: 'Raise Hand' },
              { icon: '📊', label: 'Live Poll' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(108,99,255,0.08)',
                border: '1px solid rgba(108,99,255,0.15)',
                borderRadius: '10px', padding: '12px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '20px', marginBottom: '4px' }}>{feature.icon}</p>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{feature.label}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartSession}
            disabled={!selectedCourse}
            style={{
              width: '100%', padding: '14px',
              background: selectedCourse
                ? 'linear-gradient(135deg, #fc5c7d, #6c63ff)'
                : 'rgba(255,255,255,0.05)',
              color: selectedCourse ? 'white' : '#475569',
              border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '700',
              cursor: selectedCourse ? 'pointer' : 'not-allowed',
              boxShadow: selectedCourse ? '0 8px 25px rgba(252,92,125,0.3)' : 'none'
            }}
          >
            🔴 Start Live Session
          </button>
        </div>
      ) : (
        <div>
          {/* Live Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(252,92,125,0.15), rgba(108,99,255,0.15))',
            border: '1px solid rgba(252,92,125,0.3)',
            borderRadius: '14px', padding: '20px',
            textAlign: 'center', marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '12px', height: '12px',
                background: '#fc5c7d', borderRadius: '50%',
                boxShadow: '0 0 10px #fc5c7d',
                animation: 'pulse 1s ease-in-out infinite'
              }} />
              <p style={{ color: '#fc5c7d', fontSize: '18px', fontWeight: '800' }}>
                LIVE SESSION ACTIVE
              </p>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Students are being notified and can join now!
            </p>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
          </div>

          {/* Controls */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px', marginBottom: '20px'
          }}>
            {[
              { icon: '🎤', label: 'Mute', color: '#6c63ff' },
              { icon: '📹', label: 'Camera', color: '#48cfad' },
              { icon: '🖥️', label: 'Share', color: '#f7b731' },
              { icon: '📊', label: 'Poll', color: '#a78bfa' }
            ].map((ctrl, i) => (
              <button key={i} style={{
                padding: '12px 8px',
                background: `${ctrl.color}22`,
                border: `1px solid ${ctrl.color}44`,
                borderRadius: '10px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px'
              }}>
                <span style={{ fontSize: '20px' }}>{ctrl.icon}</span>
                <span style={{ fontSize: '11px', color: ctrl.color, fontWeight: '600' }}>{ctrl.label}</span>
              </button>
            ))}
          </div>

          {/* Whiteboard Area */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', padding: '20px',
            textAlign: 'center', marginBottom: '20px',
            minHeight: '150px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div>
              <p style={{ fontSize: '30px', marginBottom: '10px' }}>🖥️</p>
              <p style={{ color: '#475569', fontSize: '14px' }}>
                Virtual Whiteboard — Share your screen to present
              </p>
            </div>
          </div>

          <button
            onClick={handleEndSession}
            style={{
              width: '100%', padding: '14px',
              background: 'rgba(252,92,125,0.15)',
              border: '1px solid rgba(252,92,125,0.3)',
              color: '#fc5c7d', borderRadius: '12px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer'
            }}
          >
            ⏹ End Live Session
          </button>
        </div>
      )}
    </div>
  );
}

export default LiveClassroom;