import { useState } from 'react';

function NotificationBell({ notifications, onClear, onClearAll, connected }) {
  const [open, setOpen] = useState(false);

  const getIcon = (type) => {
    switch(type) {
      case 'live': return '🔴';
      case 'welcome': return '👋';
      case 'info': return '💬';
      case 'success': return '✅';
      default: return '🔔';
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'live': return '#fc5c7d';
      case 'welcome': return '#48cfad';
      case 'info': return '#6c63ff';
      case 'success': return '#48cfad';
      default: return '#f7b731';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '8px 12px',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {notifications.length > 0 && (
          <div style={{
            position: 'absolute', top: '-6px', right: '-6px',
            background: '#fc5c7d',
            color: 'white', borderRadius: '50%',
            width: '18px', height: '18px',
            fontSize: '11px', fontWeight: '800',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {notifications.length > 9 ? '9+' : notifications.length}
          </div>
        )}
        {/* Connection Status */}
        <div style={{
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: connected ? '#48cfad' : '#fc5c7d',
          boxShadow: connected ? '0 0 6px #48cfad' : '0 0 6px #fc5c7d'
        }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '45px', right: 0,
          width: '320px',
          background: 'rgba(6,13,31,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ color: '#e0e6f0', fontSize: '15px', fontWeight: '700' }}>
              🔔 Notifications
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                fontSize: '12px', color: connected ? '#48cfad' : '#fc5c7d',
                fontWeight: '600'
              }}>
                {connected ? '● Live' : '○ Offline'}
              </span>
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  style={{
                    background: 'none', border: 'none',
                    color: '#475569', fontSize: '12px',
                    cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <p style={{ fontSize: '30px', marginBottom: '10px' }}>🔔</p>
                <p style={{ color: '#475569', fontSize: '14px' }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notif, i) => (
                <div key={notif.id} style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex', gap: '12px', alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: `${getColor(notif.type)}22`,
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {getIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#e0e6f0', fontSize: '13px', marginBottom: '3px' }}>
                      {notif.message}
                    </p>
                    <p style={{ color: '#475569', fontSize: '11px' }}>
                      {new Date(notif.time).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onClear(notif.id)}
                    style={{
                      background: 'none', border: 'none',
                      color: '#334155', cursor: 'pointer',
                      fontSize: '16px', padding: '0'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;