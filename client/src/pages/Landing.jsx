import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function Landing() {

  const features = [
    {
      title: 'AI Recommendations',
      desc: 'Personalized course suggestions powered by machine learning based on your interests',
      color: '#6c63ff',
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: 'Progress Tracking',
      desc: 'Real-time analytics and detailed reports on your learning journey',
      color: '#48cfad',
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M3 20h18M5 20V14M9 20V8M13 20V11M17 20V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="17" cy="4" r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Live Sessions',
      desc: 'Interactive real-time classes with expert instructors via Socket.IO',
      color: '#fc5c7d',
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 21h8M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="10" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M14 9.5c1 .5 1.5 1.5 1.5 2.5s-.5 2-1.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: 'Certificates',
      desc: 'Earn verified certificates to showcase your skills and boost your career',
      color: '#f7b731',
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 15l-2 7 6-3 6 3-2-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M10 10l1.5 1.5L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Learn Anywhere',
      desc: 'Access courses on any device, anytime, from anywhere in the world',
      color: '#a78bfa',
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: 'Community',
      desc: 'Join a thriving community of learners and instructors worldwide',
      color: '#48cfad',
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
          <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 14c2.2.5 4 2.3 4 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
  ];

  const courses = [
    { title: 'React Masterclass', category: 'Frontend', students: '2.4k', rating: '4.9', color: '#6c63ff', icon: '⚛️', lessons: 48 },
    { title: 'Node.js Backend', category: 'Backend', students: '1.8k', rating: '4.8', color: '#48cfad', icon: '🟢', lessons: 36 },
    { title: 'Machine Learning', category: 'AI/ML', students: '3.1k', rating: '4.9', color: '#f7b731', icon: '🧠', lessons: 60 },
    { title: 'UI/UX Design', category: 'Design', students: '1.2k', rating: '4.7', color: '#fc5c7d', icon: '🎨', lessons: 32 },
  ];

  return (
    <div style={{ backgroundColor: '#060d1f', overflow: 'hidden' }}>

      {/* ── HERO ── */}
      <div style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 40px',
        background: 'radial-gradient(ellipse at 60% 40%, #1a1060 0%, #060d1f 65%)',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Animated Orbs */}
        <div style={{
          position: 'absolute', top: '8%', left: '6%',
          width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(72,207,173,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '15%',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(252,92,125,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(30px)',
          animation: 'float 6s ease-in-out infinite'
        }} />

        {/* 3D Floating Cards (decorative) */}
        <div style={{
          position: 'absolute', top: '18%', left: '5%',
          background: 'rgba(108,99,255,0.12)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: '16px', padding: '14px 18px',
          transform: 'perspective(500px) rotateY(15deg) rotateX(-5deg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(108,99,255,0.2)',
          animation: 'float 7s ease-in-out infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#6c63ff,#48cfad)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p style={{ color: '#e0e6f0', fontSize: '13px', fontWeight: '700' }}>New Course</p>
              <p style={{ color: '#64748b', fontSize: '11px' }}>React Advanced</p>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', top: '25%', right: '4%',
          background: 'rgba(72,207,173,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(72,207,173,0.3)',
          borderRadius: '16px', padding: '14px 18px',
          transform: 'perspective(500px) rotateY(-15deg) rotateX(5deg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(72,207,173,0.2)',
          animation: 'float 9s ease-in-out infinite reverse'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#48cfad,#6c63ff)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p style={{ color: '#e0e6f0', fontSize: '13px', fontWeight: '700' }}>+2.4k Students</p>
              <p style={{ color: '#64748b', fontSize: '11px' }}>This month</p>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '20%', left: '7%',
          background: 'rgba(247,183,49,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(247,183,49,0.3)',
          borderRadius: '16px', padding: '14px 18px',
          transform: 'perspective(500px) rotateY(10deg) rotateX(8deg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          animation: 'float 11s ease-in-out infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#f7b731,#fc5c7d)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" stroke="white" strokeWidth="2"/><path d="M8 15l-2 7 6-3 6 3-2-7" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p style={{ color: '#e0e6f0', fontSize: '13px', fontWeight: '700' }}>95% Success</p>
              <p style={{ color: '#64748b', fontSize: '11px' }}>Completion rate</p>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(108,99,255,0.12)',
          border: '1px solid rgba(108,99,255,0.35)',
          borderRadius: '50px', padding: '8px 22px',
          marginBottom: '30px', fontSize: '14px', color: '#a78bfa',
          zIndex: 1, boxShadow: '0 0 20px rgba(108,99,255,0.2)'
        }}>
          <span style={{ width: '8px', height: '8px', background: '#6c63ff', borderRadius: '50%', boxShadow: '0 0 8px #6c63ff' }} />
          AI-Powered Learning Platform
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '78px', fontWeight: '900',
          lineHeight: '1.05', marginBottom: '25px',
          background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 45%, #48cfad 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          zIndex: 1, letterSpacing: '-2px'
        }}>
          Learn Smarter<br />with AI
        </h1>

        {/* 3D Floating AI Brain */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) translateY(-20px)',
          zIndex: 0, opacity: 0.04,
          fontSize: '400px', lineHeight: 1,
          pointerEvents: 'none'
        }}>
          ◈
        </div>

        <p style={{
          fontSize: '20px', color: '#94a3b8',
          maxWidth: '580px', lineHeight: '1.75',
          marginBottom: '50px', zIndex: 1
        }}>
          Personalized courses, live sessions, and real-time progress tracking — all powered by cutting-edge AI
        </p>

        <div style={{ display: 'flex', gap: '18px', zIndex: 1 }}>
          <Link to="/register" style={{
            background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
            color: 'white', padding: '17px 42px',
            borderRadius: '14px', fontWeight: '800', fontSize: '17px',
            boxShadow: '0 8px 30px rgba(108,99,255,0.5), 0 0 0 1px rgba(108,99,255,0.3)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Get Started Free
          </Link>
          <Link to="/login" style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            color: 'white', padding: '17px 42px',
            borderRadius: '14px', fontWeight: '700', fontSize: '17px',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            Login
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) perspective(500px) rotateY(15deg) rotateX(-5deg); }
            50% { transform: translateY(-20px) perspective(500px) rotateY(15deg) rotateX(-5deg); }
          }
        `}</style>
      </div>

      {/* ── STATS ── */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {[
          { number: '1000+', label: 'Courses', color: '#6c63ff' },
          { number: '5000+', label: 'Students', color: '#48cfad' },
          { number: '200+', label: 'Instructors', color: '#f7b731' },
          { number: '95%', label: 'Success Rate', color: '#fc5c7d' },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', padding: '45px 20px',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at center, ${stat.color}08 0%, transparent 70%)`
            }} />
            <p style={{
              fontSize: '44px', fontWeight: '900', marginBottom: '8px',
              background: `linear-gradient(135deg, ${stat.color}, white)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {stat.number}
            </p>
            <p style={{ fontSize: '15px', color: '#475569', fontWeight: '600' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding: '110px 60px', backgroundColor: '#060d1f' }}>
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <p style={{
            color: '#6c63ff', fontSize: '13px', fontWeight: '700',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '15px'
          }}>
            WHY CHOOSE US
          </p>
          <h2 style={{
            fontSize: '46px', fontWeight: '900', marginBottom: '18px',
            background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Everything You Need to<br />Accelerate Learning
          </h2>
          <p style={{ color: '#475569', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Built with cutting-edge technology to give you the best learning experience
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px', maxWidth: '1100px', margin: '0 auto'
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: `1px solid ${f.color}30`,
              borderRadius: '20px', padding: '35px 30px',
              position: 'relative', overflow: 'hidden',
              transform: 'perspective(1000px) rotateX(0deg)',
              boxShadow: `0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
              transition: 'all 0.3s ease',
            }}>
              {/* Glow top */}
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: '60%', height: '1px',
                background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)`
              }} />

              {/* Icon */}
              <div style={{
                width: '60px', height: '60px',
                background: `linear-gradient(135deg, ${f.color}30, ${f.color}10)`,
                border: `1px solid ${f.color}40`,
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '22px', color: f.color,
                boxShadow: `0 8px 20px ${f.color}20`
              }}>
                {f.svg}
              </div>

              <h3 style={{
                fontSize: '18px', fontWeight: '800',
                color: '#e0e6f0', marginBottom: '12px'
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.75' }}>
                {f.desc}
              </p>

              {/* Corner accent */}
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '80px', height: '80px',
                background: `radial-gradient(circle at bottom right, ${f.color}15, transparent)`,
                borderRadius: '20px 0 20px 0'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── COURSES ── */}
      <div style={{
        padding: '90px 60px',
        background: 'linear-gradient(180deg, #060d1f 0%, #0a0f2e 100%)',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{
            color: '#48cfad', fontSize: '13px', fontWeight: '700',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '15px'
          }}>
            TOP PICKS
          </p>
          <h2 style={{
            fontSize: '46px', fontWeight: '900', marginBottom: '15px',
            background: 'linear-gradient(135deg, #ffffff, #48cfad)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Popular Courses
          </h2>
          <p style={{ color: '#475569', fontSize: '17px' }}>
            Start learning with our most in-demand courses
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '22px', maxWidth: '1100px', margin: '0 auto'
        }}>
          {courses.map((course, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              transform: 'perspective(1000px) rotateX(2deg)',
              transition: 'all 0.3s ease'
            }}>
              {/* Card Top */}
              <div style={{
                padding: '28px 24px 20px',
                background: `linear-gradient(135deg, ${course.color}22, ${course.color}08)`,
                borderBottom: `1px solid ${course.color}30`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '100px', height: '100px',
                  background: `radial-gradient(circle, ${course.color}20, transparent)`,
                  filter: 'blur(20px)'
                }} />
                <span style={{
                  background: `${course.color}25`,
                  color: course.color, padding: '5px 14px',
                  borderRadius: '20px', fontSize: '12px', fontWeight: '800',
                  border: `1px solid ${course.color}40`,
                  letterSpacing: '0.5px'
                }}>
                  {course.category}
                </span>
                <h3 style={{
                  fontSize: '18px', fontWeight: '800',
                  color: '#e0e6f0', margin: '14px 0 0',
                  letterSpacing: '-0.3px'
                }}>
                  {course.title}
                </h3>
              </div>

              {/* Card Bottom */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#64748b" strokeWidth="2"/>
                      <circle cx="9" cy="7" r="4" stroke="#64748b" strokeWidth="2"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{course.students}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f7b731">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#f7b731', fontWeight: '700' }}>{course.rating}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  marginBottom: '18px'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: '13px', color: '#475569' }}>{course.lessons} lessons</span>
                </div>

                <Link to="/register" style={{
                  display: 'block', textAlign: 'center',
                  background: `linear-gradient(135deg, ${course.color}, ${course.color}88)`,
                  color: 'white', padding: '12px',
                  borderRadius: '10px', fontWeight: '700', fontSize: '14px',
                  boxShadow: `0 4px 15px ${course.color}40`,
                  letterSpacing: '0.3px'
                }}>
                  Enroll Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        textAlign: 'center', padding: '110px 40px',
        background: 'radial-gradient(ellipse at center, #1a1060 0%, #060d1f 65%)',
        borderTop: '1px solid rgba(108,99,255,0.15)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 65%)',
          borderRadius: '50%', filter: 'blur(40px)'
        }} />
        <p style={{
          color: '#6c63ff', fontSize: '13px', fontWeight: '700',
          letterSpacing: '3px', textTransform: 'uppercase',
          marginBottom: '20px', zIndex: 1, position: 'relative'
        }}>
          GET STARTED TODAY
        </p>
        <h2 style={{
          fontSize: '58px', fontWeight: '900', marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff, #a78bfa, #48cfad)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px', zIndex: 1, position: 'relative'
        }}>
          Ready to Transform<br />Your Learning?
        </h2>
        <p style={{
          fontSize: '18px', color: '#475569',
          marginBottom: '45px', zIndex: 1, position: 'relative'
        }}>
          Join 5,000+ students already learning on Aarivya Learn
        </p>
        <Link to="/register" style={{
          background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
          color: 'white', padding: '18px 55px',
          borderRadius: '16px', fontWeight: '800', fontSize: '18px',
          boxShadow: '0 10px 40px rgba(108,99,255,0.5), 0 0 80px rgba(108,99,255,0.15)',
          zIndex: 1, position: 'relative',
          display: 'inline-flex', alignItems: 'center', gap: '12px'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Join Now for Free
        </Link>
      </div>

    </div>
  );
}

export default Landing;