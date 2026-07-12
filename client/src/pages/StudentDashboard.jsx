import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProgress, getCourses, updateLectureProgress, enrollCourse, getRecommendations, updateInterests } from '../api';
import LectureViewer from '../components/LectureViewer';
import Quiz from '../components/Quiz';
function StudentDashboard() {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, coursesRes, recRes] = await Promise.all([
          getMyProgress(),
          getCourses(),
          getRecommendations()
        ]);
        setProgress(progressRes.data.progress || []);
        setCourses(coursesRes.data.courses || []);
        setRecommendations(recRes.data.recommendations || []);
        setUserInterests(recRes.data.userInterests || []);
        setTempInterests(recRes.data.userInterests || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCourses = progress.filter(p => p.isCompleted).length;
  const inProgressCourses = progress.filter(p => !p.isCompleted).length;
  const avgProgress = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.progressPercent, 0) / progress.length)
    : 0;

  const handleCompleteLecture = async (courseId, lectureId) => {
    try {
      await updateLectureProgress(courseId, lectureId);
      const res = await getMyProgress();
      const updatedProgress = res.data.progress || [];
      setProgress(updatedProgress);
      // Check if course is now fully completed
      const updatedCourse = updatedProgress.find(p => p.courseId._id === courseId);
      if (updatedCourse?.isCompleted) {
        setActiveQuiz(courseId);
      }
    } catch (error) {
      console.error('Error updating lecture:', error);
    }
  };

  const handleQuizSubmit = async (courseId, score) => {
    setQuizScores(prev => ({ ...prev, [courseId]: score }));
    if (score >= 70) {
      const res = await getMyProgress();
      setProgress(res.data.progress || []);
    }
  };
  const [enrollingId, setEnrollingId] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizScores, setQuizScores] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [editingInterests, setEditingInterests] = useState(false);
  const [tempInterests, setTempInterests] = useState([]);
  const [savingInterests, setSavingInterests] = useState(false);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await enrollCourse(courseId);
      const [progressRes, coursesRes] = await Promise.all([getMyProgress(), getCourses()]);
      setProgress(progressRes.data.progress || []);
      setCourses(coursesRes.data.courses || []);
      setActiveTab('my courses');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrollingId(null);
    }
  };
  const handleSaveInterests = async () => {
    setSavingInterests(true);
    try {
      await updateInterests(tempInterests);
      setUserInterests(tempInterests);
      setEditingInterests(false);
      // Refresh recommendations
      const recRes = await getRecommendations();
      setRecommendations(recRes.data.recommendations || []);
    } catch (error) {
      console.error('Error saving interests:', error);
    } finally {
      setSavingInterests(false);
    }
  };
  const generateCertificate = (courseTitle, studentName) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1200, 850);
    grad.addColorStop(0, '#060d1f');
    grad.addColorStop(1, '#1a1060');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 850);

    // Border
    ctx.strokeStyle = '#6c63ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1120, 770);
    ctx.strokeStyle = '#48cfad';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 1090, 740);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('AARIVYA LEARN', 600, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial';
    ctx.fillText('Certificate of Completion', 600, 240);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Arial';
    ctx.fillText('This certifies that', 600, 320);

    ctx.fillStyle = '#48cfad';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(studentName || 'Student', 600, 400);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Arial';
    ctx.fillText('has successfully completed the course', 600, 460);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(courseTitle || 'Course', 600, 530);

    ctx.fillStyle = '#64748b';
    ctx.font = '18px Arial';
    ctx.fillText(`Issued on ${new Date().toLocaleDateString()}`, 600, 650);
    ctx.fillText('Aarivya Labs | H & P Projects', 600, 690);

    // Download
    const link = document.createElement('a');
    link.download = `${courseTitle || 'Course'}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  const tabs = ['overview', 'my courses', 'recommendations', 'explore', 'certificates'];

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
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#64748b' }}>Loading your dashboard...</p>
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
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>
            Continue your learning journey
          </p>
        </div>
        <button
          onClick={logout}
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

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '8px',
          marginBottom: '30px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '6px'
        }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '10px',
              borderRadius: '10px', border: 'none',
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
        {activeTab === 'overview' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              {[
                { icon: '📚', label: 'Enrolled', value: progress.length, color: '#6c63ff' },
                { icon: '✅', label: 'Completed', value: completedCourses, color: '#48cfad' },
                { icon: '📖', label: 'In Progress', value: inProgressCourses, color: '#f7b731' },
                { icon: '📊', label: 'Avg Progress', value: `${avgProgress}%`, color: '#fc5c7d' },
              ].map((stat, i) => (
                <div key={i} style={{
                  flex: '1', minWidth: '150px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${stat.color}33`,
                  borderRadius: '16px', padding: '25px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '50px', height: '50px',
                    background: `${stat.color}22`,
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px', margin: '0 auto 12px'
                  }}>
                    {stat.icon}
                  </div>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: stat.color, marginBottom: '4px' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Progress Overview */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '30px',
              marginBottom: '25px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
                📊 Learning Progress Overview
              </h2>
              {progress.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '40px', marginBottom: '15px' }}>📚</p>
                  <p style={{ color: '#64748b', fontSize: '16px' }}>
                    You haven't enrolled in any courses yet!
                  </p>
                  <button
                    onClick={() => setActiveTab('explore')}
                    style={{
                      marginTop: '15px',
                      background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                      color: 'white', border: 'none',
                      padding: '12px 24px', borderRadius: '10px',
                      fontSize: '14px', fontWeight: '700'
                    }}
                  >
                    Explore Courses →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {progress.map((p, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px', padding: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#e0e6f0' }}>
                          {p.courseId?.title || 'Course'}
                        </h3>
                        <span style={{
                          color: p.isCompleted ? '#48cfad' : '#6c63ff',
                          fontWeight: '800', fontSize: '15px'
                        }}>
                          {p.progressPercent}%
                        </span>
                      </div>
                      <div style={{
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '10px', height: '8px'
                      }}>
                        <div style={{
                          background: p.isCompleted
                            ? 'linear-gradient(90deg, #48cfad, #6c63ff)'
                            : 'linear-gradient(90deg, #6c63ff, #48cfad)',
                          width: `${p.progressPercent}%`,
                          height: '8px', borderRadius: '10px',
                          boxShadow: '0 0 10px rgba(108,99,255,0.5)',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                          {p.completedLectures?.length || 0} lectures completed
                        </span>
                        <span style={{
                          fontSize: '12px', fontWeight: '700',
                          color: p.isCompleted ? '#48cfad' : '#64748b'
                        }}>
                          {p.isCompleted ? '✅ Completed!' : '⏳ In Progress'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Quick Recommendations */}
            {recommendations.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: '20px', padding: '25px',
                marginBottom: '25px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0' }}>
                    🤖 Recommended For You
                  </h2>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    style={{
                      background: 'rgba(108,99,255,0.15)',
                      border: '1px solid rgba(108,99,255,0.3)',
                      color: '#a78bfa', padding: '6px 16px',
                      borderRadius: '8px', fontSize: '13px', fontWeight: '700'
                    }}
                  >
                    View All →
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {recommendations.slice(0, 3).map((course, i) => {
                    const colors = ['#6c63ff', '#48cfad', '#f7b731'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={i} style={{
                        flex: '1', minWidth: '200px',
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${color}30`,
                        borderRadius: '12px', padding: '16px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{
                            background: `${color}22`, color,
                            padding: '3px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: '700'
                          }}>
                            {course.category}
                          </span>
                          <span style={{ fontSize: '11px', color, fontWeight: '800' }}>
                            {course.matchScore}%
                          </span>
                        </div>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#e0e6f0', marginBottom: '6px' }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>
                          {course.reason}
                        </p>
                        <button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollingId === course._id}
                          style={{
                            width: '100%', padding: '8px',
                            background: `linear-gradient(135deg, ${color}, ${color}88)`,
                            color: 'white', border: 'none',
                            borderRadius: '6px', fontSize: '12px', fontWeight: '700'
                          }}
                        >
                          {enrollingId === course._id ? '⏳' : 'Enroll →'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Activity Chart */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '30px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
                📈 Weekly Activity
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [40, 70, 55, 90, 65, 80, 45];
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '100%',
                        height: `${heights[i]}%`,
                        background: i === 3
                          ? 'linear-gradient(180deg, #6c63ff, #48cfad)'
                          : 'rgba(108,99,255,0.3)',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: i === 3 ? '0 0 15px rgba(108,99,255,0.5)' : 'none'
                      }} />
                      <span style={{ fontSize: '11px', color: '#475569' }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

       {/* MY COURSES TAB */}
        {activeTab === 'my courses' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
              📖 My Enrolled Courses
            </h2>
            {progress.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '60px', textAlign: 'center'
              }}>
                <p style={{ fontSize: '50px', marginBottom: '15px' }}>📚</p>
                <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '20px' }}>
                  No courses enrolled yet!
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  style={{
                    background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                    color: 'white', border: 'none',
                    padding: '14px 30px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '700'
                  }}
                >
                  Explore Courses →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {progress.map((p, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px', padding: '25px'
                  }}>
                    {/* Course Header */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '20px',
                      flexWrap: 'wrap', gap: '10px'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#e0e6f0', marginBottom: '4px' }}>
                          {p.courseId?.title || 'Course'}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#475569' }}>
                          {p.courseId?.category} • {p.completedLectures?.length || 0}/{p.courseId?.lectures?.length || 0} lectures completed
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '32px', fontWeight: '900', color: '#6c63ff' }}>
                          {p.progressPercent}%
                        </p>
                        <span style={{
                          background: p.isCompleted ? 'rgba(72,207,173,0.15)' : 'rgba(108,99,255,0.15)',
                          color: p.isCompleted ? '#48cfad' : '#a78bfa',
                          padding: '4px 12px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: '700'
                        }}>
                          {p.isCompleted ? '✅ Completed' : '⏳ In Progress'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '10px', height: '8px', marginBottom: '20px'
                    }}>
                      <div style={{
                        background: 'linear-gradient(90deg, #6c63ff, #48cfad)',
                        width: `${p.progressPercent}%`,
                        height: '8px', borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(108,99,255,0.5)',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>

                    {/* Lectures */}
                    {p.courseId?.lectures?.length > 0 ? (
                      <div>
                        <h4 style={{
                          color: '#94a3b8', fontSize: '13px', fontWeight: '700',
                          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px'
                        }}>
                          Lectures
                        </h4>
                        {p.courseId.lectures.map((lecture, j) => {
                          const completedIds = (p.completedLectures || []).map(id => id.toString());
                          const isCompleted = completedIds.includes(lecture._id.toString());
                          const prevCompleted = j === 0 || completedIds.includes(
                            p.courseId.lectures[j - 1]._id.toString()
                          );
                          return (
                            <div key={j} style={{ opacity: prevCompleted ? 1 : 0.5 }}>
                              {prevCompleted ? (
                                <LectureViewer
                                  lecture={lecture}
                                  isCompleted={isCompleted}
                                  onComplete={() => handleCompleteLecture(p.courseId._id, lecture._id)}
                                />
                              ) : (
                                <div style={{
                                  background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  borderRadius: '12px', padding: '16px 20px',
                                  marginBottom: '10px',
                                  display: 'flex', alignItems: 'center', gap: '12px'
                                }}>
                                  <span style={{ fontSize: '20px' }}>🔒</span>
                                  <div>
                                    <p style={{ color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                                      {lecture.title}
                                    </p>
                                    <p style={{ color: '#334155', fontSize: '12px' }}>
                                      Complete previous lecture to unlock
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: 'center', padding: '30px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px'
                      }}>
                        <p style={{ color: '#475569', fontSize: '14px' }}>
                          ⏳ No lectures added yet by instructor
                        </p>
                      </div>
                    )}

                    {/* Quiz Section */}
                    {p.isCompleted && (
                      <div style={{ marginTop: '20px' }}>
                        {quizScores[p.courseId._id] >= 70 ? (
                          <div style={{
                            background: 'rgba(72,207,173,0.1)',
                            border: '1px solid rgba(72,207,173,0.3)',
                            borderRadius: '14px', padding: '20px',
                            textAlign: 'center'
                          }}>
                            <p style={{ fontSize: '30px', marginBottom: '10px' }}>🏆</p>
                            <p style={{ color: '#48cfad', fontSize: '16px', fontWeight: '700' }}>
                              Quiz Passed! Score: {quizScores[p.courseId._id]}%
                            </p>
                            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
                              Your certificate is ready in the Certificates tab!
                            </p>
                            <button
                              onClick={() => setActiveTab('certificates')}
                              style={{
                                marginTop: '12px',
                                background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                                color: 'white', border: 'none',
                                padding: '10px 24px', borderRadius: '8px',
                                fontSize: '14px', fontWeight: '700'
                              }}
                            >
                              View Certificate →
                            </button>
                          </div>
                        ) : activeQuiz === p.courseId._id ? (
                          <div>
                            <h4 style={{
                              color: '#e0e6f0', fontSize: '18px',
                              fontWeight: '700', marginBottom: '15px'
                            }}>
                              🎯 Final Assessment
                            </h4>
                            <Quiz
                              courseTitle={p.courseId?.title}
                              courseDescription={p.courseId?.description}
                              onSubmit={(score) => handleQuizSubmit(p.courseId._id, score)}
                            />
                          </div>
                        ) : (
                          <div style={{
                            background: 'rgba(108,99,255,0.1)',
                            border: '1px solid rgba(108,99,255,0.3)',
                            borderRadius: '14px', padding: '20px',
                            textAlign: 'center'
                          }}>
                            <p style={{ fontSize: '30px', marginBottom: '10px' }}>🎯</p>
                            <p style={{ color: '#a78bfa', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                              Course Complete! Take the Final Quiz
                            </p>
                            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '15px' }}>
                              Score 70%+ to earn your certificate!
                            </p>
                            <button
                              onClick={() => setActiveQuiz(p.courseId._id)}
                              style={{
                                background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                                color: 'white', border: 'none',
                                padding: '12px 28px', borderRadius: '10px',
                                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(108,99,255,0.4)'
                              }}
                            >
                              Start Quiz 🚀
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px'
            }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#e0e6f0', marginBottom: '6px' }}>
                  🤖 AI Recommendations
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  Personalized courses based on your interests and activity
                </p>
              </div>
              <button
                onClick={() => setEditingInterests(!editingInterests)}
                style={{
                  background: 'rgba(108,99,255,0.15)',
                  border: '1px solid rgba(108,99,255,0.3)',
                  color: '#a78bfa', padding: '10px 20px',
                  borderRadius: '10px', fontSize: '14px', fontWeight: '700'
                }}
              >
                ✏️ Edit Interests
              </button>
            </div>

            {/* Edit Interests Panel */}
            {editingInterests && (
              <div style={{
                background: 'rgba(108,99,255,0.08)',
                border: '1px solid rgba(108,99,255,0.25)',
                borderRadius: '16px', padding: '25px',
                marginBottom: '25px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#e0e6f0', marginBottom: '15px' }}>
                  🎯 Select Your Interests
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                  {['Programming', 'Web Development', 'Data Science', 'AI/ML', 'Design',
                    'DevOps', 'Mobile Apps', 'Cybersecurity', 'Cloud Computing', 'Blockchain'].map(interest => (
                    <button
                      key={interest}
                      onClick={() => setTempInterests(prev =>
                        prev.includes(interest)
                          ? prev.filter(i => i !== interest)
                          : [...prev, interest]
                      )}
                      style={{
                        padding: '8px 16px', borderRadius: '20px',
                        border: tempInterests.includes(interest)
                          ? '2px solid #6c63ff'
                          : '1px solid rgba(255,255,255,0.1)',
                        background: tempInterests.includes(interest)
                          ? 'rgba(108,99,255,0.2)'
                          : 'rgba(255,255,255,0.03)',
                        color: tempInterests.includes(interest) ? '#a78bfa' : '#64748b',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                      }}
                    >
                      {tempInterests.includes(interest) ? '✓ ' : ''}{interest}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSaveInterests}
                    disabled={savingInterests}
                    style={{
                      flex: 1, padding: '12px',
                      background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                      color: 'white', border: 'none',
                      borderRadius: '10px', fontSize: '14px', fontWeight: '700'
                    }}
                  >
                    {savingInterests ? '⏳ Saving...' : '✅ Save & Refresh'}
                  </button>
                  <button
                    onClick={() => { setEditingInterests(false); setTempInterests(userInterests); }}
                    style={{
                      flex: 1, padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#64748b', borderRadius: '10px',
                      fontSize: '14px', fontWeight: '700'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Current Interests */}
            {userInterests.length > 0 && (
              <div style={{ marginBottom: '25px' }}>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '10px' }}>
                  Your interests:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {userInterests.map((interest, i) => (
                    <span key={i} style={{
                      background: 'rgba(108,99,255,0.15)',
                      border: '1px solid rgba(108,99,255,0.3)',
                      color: '#a78bfa', padding: '4px 14px',
                      borderRadius: '20px', fontSize: '13px', fontWeight: '600'
                    }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Grid */}
            {recommendations.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '60px', textAlign: 'center'
              }}>
                <p style={{ fontSize: '50px', marginBottom: '15px' }}>🤖</p>
                <p style={{ color: '#e0e6f0', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
                  No Recommendations Yet!
                </p>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                  Add your interests above or enroll in some courses to get personalized recommendations!
                </p>
                <button
                  onClick={() => setEditingInterests(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                    color: 'white', border: 'none',
                    padding: '12px 24px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: '700'
                  }}
                >
                  Add Interests →
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Recommended For You
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px', marginBottom: '30px'
                }}>
                  {recommendations.map((course, i) => {
                    const colors = ['#6c63ff', '#48cfad', '#f7b731', '#fc5c7d', '#a78bfa', '#48cfad'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${color}30`,
                        borderRadius: '16px', overflow: 'hidden',
                        position: 'relative'
                      }}>
                        {/* Match Score Badge */}
                        <div style={{
                          position: 'absolute', top: '12px', right: '12px',
                          background: `${color}22`,
                          border: `1px solid ${color}44`,
                          color, padding: '3px 10px',
                          borderRadius: '20px', fontSize: '12px', fontWeight: '800'
                        }}>
                          {course.matchScore}% match
                        </div>

                        {/* Card Top */}
                        <div style={{
                          padding: '20px',
                          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                          borderBottom: `1px solid ${color}20`
                        }}>
                          <span style={{
                            background: `${color}22`, color,
                            padding: '4px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: '700'
                          }}>
                            {course.category}
                          </span>
                          <h3 style={{
                            fontSize: '16px', fontWeight: '700',
                            color: '#e0e6f0', margin: '10px 0 6px',
                            paddingRight: '60px'
                          }}>
                            {course.title}
                          </h3>
                          <p style={{ fontSize: '12px', color: '#475569' }}>
                            by {course.instructorName}
                          </p>
                        </div>

                        {/* Card Bottom */}
                        <div style={{ padding: '15px 20px' }}>
                          {/* Why Recommended */}
                          <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px', padding: '10px 12px',
                            marginBottom: '12px'
                          }}>
                            <p style={{ fontSize: '11px', color: '#6c63ff', fontWeight: '700', marginBottom: '3px' }}>
                              🤖 WHY RECOMMENDED
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                              {course.reason}
                            </p>
                          </div>

                          {/* Stats */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#475569' }}>
                              👨‍🎓 {course.enrolledCount} enrolled
                            </span>
                            <span style={{ fontSize: '12px', color: '#f7b731' }}>
                              ⭐ {course.rating || 'New'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#475569', textTransform: 'capitalize' }}>
                              📊 {course.level}
                            </span>
                          </div>

                          {/* Enroll Button */}
                          <button
                            onClick={() => handleEnroll(course._id)}
                            disabled={enrollingId === course._id}
                            style={{
                              width: '100%', padding: '10px',
                              background: `linear-gradient(135deg, ${color}, ${color}88)`,
                              color: 'white', border: 'none',
                              borderRadius: '8px', fontSize: '13px', fontWeight: '700'
                            }}
                          >
                            {enrollingId === course._id ? '⏳ Enrolling...' : 'Enroll Now →'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
              🌐 Explore Courses
            </h2>
            {courses.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '60px', textAlign: 'center'
              }}>
                <p style={{ fontSize: '50px', marginBottom: '15px' }}>🔍</p>
                <p style={{ color: '#64748b', fontSize: '18px' }}>
                  No published courses available yet!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }}>
                {courses.map((course, i) => {
                  const colors = ['#6c63ff', '#48cfad', '#f7b731', '#fc5c7d'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${color}30`,
                      borderRadius: '16px', overflow: 'hidden'
                    }}>
                      <div style={{
                        padding: '20px',
                        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
                        borderBottom: `1px solid ${color}30`
                      }}>
                        <span style={{
                          background: `${color}25`, color,
                          padding: '4px 12px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: '700'
                        }}>
                          {course.category}
                        </span>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#e0e6f0', marginTop: '12px' }}>
                          {course.title}
                        </h3>
                      </div>
                      <div style={{ padding: '15px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '15px' }}>
                          👨‍🎓 {course.enrolledCount} enrolled • ⭐ {course.rating || 'New'}
                        </p>
                        <button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollingId === course._id}
                          style={{
                            width: '100%', padding: '10px',
                            background: `linear-gradient(135deg, ${color}, ${color}88)`,
                            color: 'white', border: 'none',
                            borderRadius: '8px', fontSize: '14px', fontWeight: '700'
                          }}>
                          {enrollingId === course._id ? '⏳ Enrolling...' : 'Enroll Now →'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
              🏆 My Certificates
            </h2>
            {completedCourses === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '60px', textAlign: 'center'
              }}>
                <p style={{ fontSize: '60px', marginBottom: '15px' }}>🏆</p>
                <p style={{ color: '#e0e6f0', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
                  No Certificates Yet!
                </p>
                <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '25px' }}>
                  Complete a course to earn your first certificate!
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  style={{
                    background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                    color: 'white', border: 'none',
                    padding: '14px 30px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '700'
                  }}
                >
                  Start Learning →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {progress.filter(p => p.isCompleted && quizScores[p.courseId._id] >= 70).map((p, i) => (
                  <div key={i} style={{
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(72,207,173,0.1))',
                    border: '1px solid rgba(108,99,255,0.3)',
                    borderRadius: '20px', padding: '30px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(108,99,255,0.2)'
                  }}>
                    <p style={{ fontSize: '50px', marginBottom: '15px' }}>🏆</p>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#e0e6f0', marginBottom: '8px' }}>
                      {p.courseId?.title}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '15px' }}>
                      Completed on {new Date(p.lastAccessed).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => generateCertificate(p.courseId?.title, user?.name)}
                      style={{
                        background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                        color: 'white', border: 'none',
                        padding: '10px 24px', borderRadius: '8px',
                        fontSize: '14px', fontWeight: '700'
                      }}>
                      Download Certificate
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;