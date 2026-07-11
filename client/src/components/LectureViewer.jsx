import { useState, useEffect } from 'react';

function LectureViewer({ lecture, onComplete, isCompleted }) {
  const [timer, setTimer] = useState(30);
  const [canComplete, setCanComplete] = useState(false);
  const [watching, setWatching] = useState(false);

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      let videoId = null;
      if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(lecture?.videoUrl);

  useEffect(() => {
    let interval;
    if (watching && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanComplete(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [watching, timer]);

  const handleStartWatching = () => {
    setWatching(true);
    setTimer(30);
    setCanComplete(false);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(108,99,255,0.2)',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '15px'
    }}>
      {/* Lecture Header */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(108,99,255,0.1)',
        borderBottom: '1px solid rgba(108,99,255,0.2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: isCompleted
              ? 'rgba(72,207,173,0.2)'
              : 'rgba(108,99,255,0.2)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px'
          }}>
            {isCompleted ? '✅' : '🎬'}
          </div>
          <div>
            <p style={{ color: '#e0e6f0', fontSize: '15px', fontWeight: '700' }}>
              {lecture.title}
            </p>
            <p style={{ color: '#475569', fontSize: '12px' }}>
              {lecture.duration} min • {isCompleted ? 'Completed' : 'Not completed'}
            </p>
          </div>
        </div>
        {isCompleted && (
          <span style={{
            background: 'rgba(72,207,173,0.15)',
            color: '#48cfad', padding: '4px 12px',
            borderRadius: '20px', fontSize: '12px', fontWeight: '700'
          }}>
            ✅ Done
          </span>
        )}
      </div>

      {/* Video Player */}
      {embedUrl ? (
        <div style={{ padding: '20px' }}>
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0, overflow: 'hidden',
            borderRadius: '12px',
            background: '#000',
            marginBottom: '15px'
          }}>
            <iframe
              src={embedUrl}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                border: 'none', borderRadius: '12px'
              }}
              allowFullScreen
              title={lecture.title}
            />
          </div>

          {/* Timer and Complete Button */}
          {!isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!watching ? (
                <button
                  onClick={handleStartWatching}
                  style={{
                    background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                    color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  ▶ Start Watching
                </button>
              ) : !canComplete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '45px', height: '45px',
                    border: '3px solid rgba(108,99,255,0.3)',
                    borderTop: '3px solid #6c63ff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <div>
                    <p style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '700' }}>
                      Watch for {timer} more seconds...
                    </p>
                    <p style={{ color: '#475569', fontSize: '12px' }}>
                      Complete button will unlock soon!
                    </p>
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <button
                  onClick={onComplete}
                  style={{
                    background: 'linear-gradient(135deg, #48cfad, #6c63ff)',
                    color: 'white', border: 'none',
                    padding: '12px 24px', borderRadius: '10px',
                    fontSize: '15px', fontWeight: '800', cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(72,207,173,0.4)',
                    animation: 'pulse 1s ease-in-out infinite'
                  }}
                >
                  ✅ Mark as Complete!
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '30px',
            textAlign: 'center', marginBottom: '15px'
          }}>
            <p style={{ fontSize: '30px', marginBottom: '10px' }}>🎬</p>
            <p style={{ color: '#475569', fontSize: '14px' }}>
              No video added for this lecture yet
            </p>
          </div>

          {/* Allow completing without video */}
          {!isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!watching ? (
                <button
                  onClick={handleStartWatching}
                  style={{
                    background: 'rgba(108,99,255,0.2)',
                    border: '1px solid rgba(108,99,255,0.4)',
                    color: '#a78bfa', padding: '10px 20px',
                    borderRadius: '10px', fontSize: '14px',
                    fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  ⏱ Start 30s Timer
                </button>
              ) : !canComplete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '45px', height: '45px',
                    border: '3px solid rgba(108,99,255,0.3)',
                    borderTop: '3px solid #6c63ff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '700' }}>
                    {timer} seconds remaining...
                  </p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <button
                  onClick={onComplete}
                  style={{
                    background: 'linear-gradient(135deg, #48cfad, #6c63ff)',
                    color: 'white', border: 'none',
                    padding: '12px 24px', borderRadius: '10px',
                    fontSize: '15px', fontWeight: '800', cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(72,207,173,0.4)'
                  }}
                >
                  ✅ Mark as Complete!
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LectureViewer;