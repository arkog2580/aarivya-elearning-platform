import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { getInstructorAssignments, createAssignment, gradeAssignment } from '../api';
import NotificationBell from '../components/NotificationBell';
import LiveClassroom from '../components/LiveClassroom';
import CourseChat from '../components/CourseChat';
import { useSocket } from '../hooks/useSocket';

function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { socket, connected, notifications, clearNotification, clearAllNotifications, startLiveSession, endLiveSession } = useSocket(user);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '', description: '', category: '', level: 'beginner', price: 0
  });
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [lectureCourseId, setLectureCourseId] = useState(null);
  const [newLecture, setNewLecture] = useState({ title: '', videoUrl: '', duration: 10 });
  const [addingLecture, setAddingLecture] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    courseId: '', title: '', description: '', dueDate: '', maxMarks: 100
  });
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [assignmentMsg, setAssignmentMsg] = useState('');
  const [gradingId, setGradingId] = useState(null);
  const [gradeData, setGradeData] = useState({});

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await getInstructorAssignments();
      setAssignments(res.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses/instructor/mycourses');
      setCourses(res.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.category) {
      setFormError('Please fill in all required fields!');
      return;
    }
    setCreating(true);
    setFormError('');
    try {
      await API.post('/courses', { ...newCourse, status: 'pending' });
      setSuccessMsg('Course created! Submitted for admin approval.');
      setShowCreateForm(false);
      setNewCourse({ title: '', description: '', category: '', level: 'beginner', price: 0 });
      fetchCourses();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This cannot be undone!')) return;
    setDeletingCourse(courseId);
    try {
      await API.delete(`/courses/${courseId}`);
      setSuccessMsg('Course deleted successfully!');
      fetchCourses();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeletingCourse(null);
    }
  };

  const handleAddLecture = async (courseId) => {
    if (!newLecture.title) {
      setFormError('Please enter a lecture title!');
      return;
    }
    setAddingLecture(true);
    try {
      const course = courses.find(c => c._id === courseId);
      const updatedLectures = [
        ...(course.lectures || []),
        {
          title: newLecture.title,
          videoUrl: newLecture.videoUrl,
          duration: Number(newLecture.duration),
          order: (course.lectures?.length || 0) + 1
        }
      ];
      await API.put(`/courses/${courseId}`, { lectures: updatedLectures });
      setSuccessMsg('Lecture added! Course resubmitted for approval.');
      setNewLecture({ title: '', videoUrl: '', duration: 10 });
      setLectureCourseId(null);
      fetchCourses();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setFormError('Failed to add lecture');
    } finally {
      setAddingLecture(false);
    }
  };

  const handleDeleteLecture = async (courseId, lectureIndex) => {
    if (!window.confirm('Delete this lecture?')) return;
    try {
      const course = courses.find(c => c._id === courseId);
      const updatedLectures = course.lectures.filter((_, i) => i !== lectureIndex);
      await API.put(`/courses/${courseId}`, { lectures: updatedLectures });
      setSuccessMsg('Lecture deleted! Course resubmitted for approval.');
      fetchCourses();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setFormError('Failed to delete lecture');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
  const publishedCourses = courses.filter(c => c.status === 'published').length;
  const pendingCourses = courses.filter(c => c.status === 'pending').length;

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '10px', color: '#e0e6f0',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', marginBottom: '14px'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060d1f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', border: '3px solid rgba(108,99,255,0.3)', borderTop: '3px solid #6c63ff', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748b' }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#060d1f', minHeight: '100vh' }}>

      {/* Top Bar */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #48cfad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Instructor Dashboard 👨‍🏫
          </h1>
          <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>Welcome back, {user?.name}!</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <NotificationBell
            notifications={notifications}
            onClear={clearNotification}
            onClearAll={clearAllNotifications}
            connected={connected}
          />
          <button onClick={() => setShowCreateForm(true)} style={{ background: 'linear-gradient(135deg, #6c63ff, #48cfad)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}>
            + Create Course
          </button>
          <button onClick={handleLogout} style={{ background: 'rgba(252,92,125,0.15)', border: '1px solid rgba(252,92,125,0.3)', color: '#fc5c7d', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '30px 50px' }}>

        {/* Messages */}
        {successMsg && (
          <div style={{ background: 'rgba(72,207,173,0.1)', border: '1px solid rgba(72,207,173,0.3)', borderRadius: '12px', padding: '15px 20px', color: '#48cfad', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>
            ✅ {successMsg}
          </div>
        )}
        {formError && (
          <div style={{ background: 'rgba(252,92,125,0.1)', border: '1px solid rgba(252,92,125,0.3)', borderRadius: '12px', padding: '15px 20px', color: '#fc5c7d', marginBottom: '20px', fontSize: '15px' }}>
            ⚠️ {formError}
          </div>
        )}

        {/* Create Course Form */}
        {showCreateForm && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '20px', padding: '30px', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>📝 Create New Course</h2>
            <input placeholder="Course Title *" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} style={inputStyle} />
            <textarea placeholder="Course Description *" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} style={{...inputStyle, height: '100px', resize: 'vertical'}} />
            <input placeholder="Category * (e.g. Programming, Design)" value={newCourse.category} onChange={(e) => setNewCourse({...newCourse, category: e.target.value})} style={inputStyle} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <select value={newCourse.level} onChange={(e) => setNewCourse({...newCourse, level: e.target.value})} style={{...inputStyle, flex: 1}}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <input type="number" placeholder="Price ($)" value={newCourse.price} onChange={(e) => setNewCourse({...newCourse, price: e.target.value})} style={{...inputStyle, flex: 1}} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleCreateCourse} disabled={creating} style={{ flex: 1, padding: '12px', background: creating ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6c63ff, #48cfad)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700' }}>
                {creating ? '⏳ Creating...' : '🚀 Create Course'}
              </button>
              <button onClick={() => { setShowCreateForm(false); setFormError(''); }} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '10px', fontSize: '15px', fontWeight: '700' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '6px' }}>
          {['overview', 'my courses', 'assignments', 'live classroom', 'analytics'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === tab ? 'linear-gradient(135deg, #6c63ff, #48cfad)' : 'transparent', color: activeTab === tab ? 'white' : '#64748b', fontSize: '14px', fontWeight: '700', textTransform: 'capitalize', cursor: 'pointer' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              {[
                { icon: '📚', label: 'Total Courses', value: courses.length, color: '#6c63ff' },
                { icon: '👨‍🎓', label: 'Total Students', value: totalStudents, color: '#48cfad' },
                { icon: '✅', label: 'Published', value: publishedCourses, color: '#f7b731' },
                { icon: '⏳', label: 'Pending', value: pendingCourses, color: '#fc5c7d' },
              ].map((stat, i) => (
                <div key={i} style={{ flex: '1', minWidth: '150px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${stat.color}33`, borderRadius: '16px', padding: '25px', textAlign: 'center' }}>
                  <div style={{ width: '50px', height: '50px', background: `${stat.color}22`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 12px' }}>{stat.icon}</div>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: stat.color, marginBottom: '4px' }}>{stat.value}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Course List */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>📋 My Courses</h2>
              {courses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '40px', marginBottom: '15px' }}>📝</p>
                  <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '20px' }}>No courses yet! Create your first course.</p>
                  <button onClick={() => setShowCreateForm(true)} style={{ background: 'linear-gradient(135deg, #6c63ff, #48cfad)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}>
                    + Create Course
                  </button>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(108,99,255,0.1)' }}>
                      {['Title', 'Category', 'Lectures', 'Students', 'Status', 'Actions'].map((h, i) => (
                        <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '16px', color: '#e0e6f0', fontWeight: '600', fontSize: '15px' }}>{course.title}</td>
                        <td style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>{course.category}</td>
                        <td style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>{course.lectures?.length || 0}</td>
                        <td style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>👨‍🎓 {course.enrolledCount}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ background: course.status === 'published' ? 'rgba(72,207,173,0.15)' : course.status === 'pending' ? 'rgba(247,183,49,0.15)' : 'rgba(100,116,139,0.15)', color: course.status === 'published' ? '#48cfad' : course.status === 'pending' ? '#f7b731' : '#64748b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>
                            {course.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            disabled={deletingCourse === course._id}
                            style={{ background: 'rgba(252,92,125,0.15)', border: '1px solid rgba(252,92,125,0.3)', color: '#fc5c7d', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}
                          >
                            {deletingCourse === course._id ? '⏳' : '🗑 Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* MY COURSES TAB */}
        {activeTab === 'my courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {courses.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '60px', textAlign: 'center' }}>
                <p style={{ fontSize: '50px', marginBottom: '15px' }}>📝</p>
                <p style={{ color: '#64748b', fontSize: '18px' }}>No courses yet!</p>
              </div>
            ) : courses.map((course, i) => {
              const colors = ['#6c63ff', '#48cfad', '#f7b731', '#fc5c7d'];
              const color = colors[i % colors.length];
              return (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}30`, borderRadius: '20px', overflow: 'hidden' }}>

                  {/* Course Header */}
                  <div style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e0e6f0', marginBottom: '4px' }}>{course.title}</h3>
                      <p style={{ fontSize: '13px', color: '#475569' }}>{course.category} • {course.level} • {course.lectures?.length || 0} lectures • {course.enrolledCount} students</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ background: course.status === 'published' ? 'rgba(72,207,173,0.15)' : 'rgba(247,183,49,0.15)', color: course.status === 'published' ? '#48cfad' : '#f7b731', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>
                        {course.status}
                      </span>
                      <button
                        onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
                        style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#a78bfa', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}
                      >
                        {expandedCourse === course._id ? 'Hide ▲' : 'Manage ▼'}
                      </button>
                      <button
                        onClick={() => {
                          const id = course._id?.toString();
                          setActiveChat(prev => prev === id ? null : id);
                        }}
                        style={{
                          background: activeChat === course._id?.toString()
                            ? 'linear-gradient(135deg, #6c63ff, #48cfad)'
                            : 'rgba(108,99,255,0.15)',
                          border: '1px solid rgba(108,99,255,0.3)',
                          color: activeChat === course._id?.toString() ? 'white' : '#a78bfa',
                          padding: '6px 14px', borderRadius: '8px',
                          fontSize: '13px', fontWeight: '600'
                        }}
                      >
                        💬 Chat
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        style={{ background: 'rgba(252,92,125,0.15)', border: '1px solid rgba(252,92,125,0.3)', color: '#fc5c7d', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {expandedCourse === course._id && (
                    <div style={{ padding: '0 25px 25px', borderTop: `1px solid ${color}20` }}>

                      {/* Existing Lectures */}
                      {course.lectures?.length > 0 && (
                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                          <h4 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                            Current Lectures
                          </h4>
                          {course.lectures.map((lec, j) => (
                            <div key={j} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ color: '#e0e6f0', fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                                  {j + 1}. {lec.title}
                                </p>
                                <p style={{ color: '#475569', fontSize: '12px' }}>
                                  {lec.duration} min • {lec.videoUrl ? '🎬 Has video' : '📄 No video'}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteLecture(course._id, j)}
                                style={{ background: 'rgba(252,92,125,0.15)', border: '1px solid rgba(252,92,125,0.3)', color: '#fc5c7d', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Lecture */}
                      <div style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', padding: '18px' }}>
                        <h4 style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>
                          + Add New Lecture
                        </h4>
                        {lectureCourseId === course._id ? (
                          <div>
                            <input
                              placeholder="Lecture title *"
                              value={newLecture.title}
                              onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                              style={{ ...inputStyle, marginBottom: '10px' }}
                            />
                            <input
                              placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=xxxxx)"
                              value={newLecture.videoUrl}
                              onChange={(e) => setNewLecture({ ...newLecture, videoUrl: e.target.value })}
                              style={{ ...inputStyle, marginBottom: '10px' }}
                            />
                            <input
                              type="number"
                              placeholder="Duration (mins)"
                              value={newLecture.duration}
                              onChange={(e) => setNewLecture({ ...newLecture, duration: e.target.value })}
                              style={{ ...inputStyle, marginBottom: '14px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                onClick={() => handleAddLecture(course._id)}
                                disabled={addingLecture}
                                style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #6c63ff, #48cfad)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700' }}
                              >
                                {addingLecture ? '⏳ Adding...' : '✅ Add Lecture'}
                              </button>
                              <button
                                onClick={() => setLectureCourseId(null)}
                                style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '8px', fontSize: '14px', fontWeight: '700' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setLectureCourseId(course._id)}
                            style={{ width: '100%', padding: '10px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#a78bfa', borderRadius: '8px', fontSize: '14px', fontWeight: '700' }}
                          >
                            + Add Lecture
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#e0e6f0', marginBottom: '6px' }}>
                  📝 Assignments
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  Create and grade student assignments
                </p>
              </div>
              <button
                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                style={{
                  background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                  color: 'white', border: 'none',
                  padding: '10px 20px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700'
                }}
              >
                + Create Assignment
              </button>
            </div>

            {/* Assignment Success Message */}
            {assignmentMsg && (
              <div style={{
                background: 'rgba(72,207,173,0.1)',
                border: '1px solid rgba(72,207,173,0.3)',
                borderRadius: '12px', padding: '15px 20px',
                color: '#48cfad', marginBottom: '20px',
                fontSize: '15px', fontWeight: '600'
              }}>
                ✅ {assignmentMsg}
              </div>
            )}

            {/* Create Assignment Form */}
            {showAssignmentForm && (
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(108,99,255,0.3)',
                borderRadius: '20px', padding: '25px',
                marginBottom: '25px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>
                  📝 New Assignment
                </h3>

                {/* Course Select */}
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Select Course *
                </label>
                <select
                  value={newAssignment.courseId}
                  onChange={(e) => setNewAssignment({...newAssignment, courseId: e.target.value})}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(108,99,255,0.3)',
                    borderRadius: '10px', color: '#e0e6f0',
                    fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box', marginBottom: '14px'
                  }}
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course, i) => (
                    <option key={i} value={course._id}>{course.title}</option>
                  ))}
                </select>

                {/* Title */}
                <input
                  placeholder="Assignment Title *"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(108,99,255,0.3)',
                    borderRadius: '10px', color: '#e0e6f0',
                    fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box', marginBottom: '14px'
                  }}
                />

                {/* Description */}
                <textarea
                  placeholder="Assignment Description & Instructions *"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(108,99,255,0.3)',
                    borderRadius: '10px', color: '#e0e6f0',
                    fontSize: '14px', outline: 'none',
                    minHeight: '100px', resize: 'vertical',
                    boxSizing: 'border-box', marginBottom: '14px'
                  }}
                />

                {/* Due Date and Max Marks */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Due Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                      style={{
                        width: '100%', padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(108,99,255,0.3)',
                        borderRadius: '10px', color: '#e0e6f0',
                        fontSize: '14px', outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Max Marks
                    </label>
                    <input
                      type="number"
                      value={newAssignment.maxMarks}
                      onChange={(e) => setNewAssignment({...newAssignment, maxMarks: e.target.value})}
                      style={{
                        width: '100%', padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(108,99,255,0.3)',
                        borderRadius: '10px', color: '#e0e6f0',
                        fontSize: '14px', outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={async () => {
                      if (!newAssignment.courseId || !newAssignment.title || !newAssignment.description || !newAssignment.dueDate) {
                        setAssignmentMsg('Please fill all required fields!');
                        return;
                      }
                      setCreatingAssignment(true);
                      try {
                        await createAssignment(newAssignment);
                        setAssignmentMsg('Assignment created successfully!');
                        setShowAssignmentForm(false);
                        setNewAssignment({ courseId: '', title: '', description: '', dueDate: '', maxMarks: 100 });
                        fetchAssignments();
                        setTimeout(() => setAssignmentMsg(''), 3000);
                      } catch (error) {
                        setAssignmentMsg('Failed to create assignment');
                      } finally {
                        setCreatingAssignment(false);
                      }
                    }}
                    disabled={creatingAssignment}
                    style={{
                      flex: 1, padding: '12px',
                      background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
                      color: 'white', border: 'none',
                      borderRadius: '10px', fontSize: '15px', fontWeight: '700'
                    }}
                  >
                    {creatingAssignment ? '⏳ Creating...' : '🚀 Create Assignment'}
                  </button>
                  <button
                    onClick={() => setShowAssignmentForm(false)}
                    style={{
                      flex: 1, padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#64748b', borderRadius: '10px',
                      fontSize: '15px', fontWeight: '700'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Assignments List */}
            {assignments.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '60px', textAlign: 'center'
              }}>
                <p style={{ fontSize: '50px', marginBottom: '15px' }}>📝</p>
                <p style={{ color: '#64748b', fontSize: '18px' }}>
                  No assignments created yet!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {assignments.map((assignment, i) => {
                  const colors = ['#6c63ff', '#48cfad', '#f7b731', '#fc5c7d'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${color}30`,
                      borderRadius: '20px', overflow: 'hidden'
                    }}>
                      {/* Header */}
                      <div style={{
                        padding: '20px 25px',
                        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                        borderBottom: `1px solid ${color}20`,
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: '10px'
                      }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#e0e6f0', marginBottom: '4px' }}>
                            {assignment.title}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#475569' }}>
                            📚 {assignment.courseId?.title} • Max: {assignment.maxMarks} marks •
                            Due: {new Date(assignment.dueDate).toLocaleDateString()} •
                            {assignment.submissions?.length || 0} submissions
                          </p>
                        </div>
                        <span style={{
                          background: `${color}22`, color,
                          padding: '4px 14px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: '700'
                        }}>
                          {assignment.submissions?.length || 0} Submitted
                        </span>
                      </div>

                      {/* Submissions */}
                      <div style={{ padding: '20px 25px' }}>
                        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                          {assignment.description}
                        </p>

                        {assignment.submissions?.length === 0 ? (
                          <p style={{ color: '#475569', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                            No submissions yet
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              Student Submissions
                            </h4>
                            {assignment.submissions.map((sub, j) => (
                              <div key={j} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px', padding: '18px'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <p style={{ color: '#e0e6f0', fontSize: '15px', fontWeight: '700' }}>
                                      {sub.studentName}
                                    </p>
                                    <p style={{ color: '#475569', fontSize: '12px' }}>
                                      Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  {sub.status === 'graded' && (
                                    <span style={{
                                      background: 'rgba(247,183,49,0.15)',
                                      color: '#f7b731', padding: '4px 12px',
                                      borderRadius: '20px', fontSize: '12px', fontWeight: '700'
                                    }}>
                                      🏆 {sub.grade}/{assignment.maxMarks}
                                    </span>
                                  )}
                                </div>

                                <div style={{
                                  background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid rgba(255,255,255,0.05)',
                                  borderRadius: '8px', padding: '12px',
                                  marginBottom: '14px'
                                }}>
                                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                                    {sub.submissionText}
                                  </p>
                                </div>

                                {/* Grade Form */}
                                {sub.status !== 'graded' && (
                                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                      type="number"
                                      placeholder={`Grade (0-${assignment.maxMarks})`}
                                      value={gradeData[`${assignment._id}_${sub.studentId}`]?.grade || ''}
                                      onChange={(e) => setGradeData(prev => ({
                                        ...prev,
                                        [`${assignment._id}_${sub.studentId}`]: {
                                          ...prev[`${assignment._id}_${sub.studentId}`],
                                          grade: e.target.value
                                        }
                                      }))}
                                      style={{
                                        width: '120px', padding: '8px 12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(108,99,255,0.3)',
                                        borderRadius: '8px', color: '#e0e6f0',
                                        fontSize: '13px', outline: 'none'
                                      }}
                                    />
                                    <input
                                      placeholder="Feedback (optional)"
                                      value={gradeData[`${assignment._id}_${sub.studentId}`]?.feedback || ''}
                                      onChange={(e) => setGradeData(prev => ({
                                        ...prev,
                                        [`${assignment._id}_${sub.studentId}`]: {
                                          ...prev[`${assignment._id}_${sub.studentId}`],
                                          feedback: e.target.value
                                        }
                                      }))}
                                      style={{
                                        flex: 1, padding: '8px 12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(108,99,255,0.3)',
                                        borderRadius: '8px', color: '#e0e6f0',
                                        fontSize: '13px', outline: 'none',
                                        minWidth: '150px'
                                      }}
                                    />
                                    <button
                                      onClick={async () => {
                                        const key = `${assignment._id}_${sub.studentId}`;
                                        const data = gradeData[key];
                                        if (!data?.grade) return;
                                        setGradingId(key);
                                        try {
                                          await gradeAssignment(assignment._id, sub.studentId, {
                                            grade: Number(data.grade),
                                            feedback: data.feedback || ''
                                          });
                                          setAssignmentMsg('Assignment graded successfully!');
                                          fetchAssignments();
                                          setTimeout(() => setAssignmentMsg(''), 3000);
                                        } catch (error) {
                                          setAssignmentMsg('Failed to grade assignment');
                                        } finally {
                                          setGradingId(null);
                                        }
                                      }}
                                      disabled={gradingId === `${assignment._id}_${sub.studentId}`}
                                      style={{
                                        padding: '8px 18px',
                                        background: 'linear-gradient(135deg, #f7b731, #fc5c7d)',
                                        color: 'white', border: 'none',
                                        borderRadius: '8px', fontSize: '13px',
                                        fontWeight: '700', cursor: 'pointer'
                                      }}
                                    >
                                      {gradingId === `${assignment._id}_${sub.studentId}` ? '⏳' : '🏆 Grade'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* LIVE CLASSROOM TAB */}
        {activeTab === 'live classroom' && (
          <LiveClassroom
            user={user}
            socket={socket}
            enrolledCourses={courses}
          />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>📈 Enrollment Analytics</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '150px' }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, i) => {
                  const heights = [30, 50, 40, 70, 55, 85, 65];
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '100%', height: `${heights[i]}%`, background: i === 5 ? 'linear-gradient(180deg, #6c63ff, #48cfad)' : 'rgba(108,99,255,0.3)', borderRadius: '6px 6px 0 0' }} />
                      <span style={{ fontSize: '11px', color: '#475569' }}>{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e0e6f0', marginBottom: '20px' }}>🎯 Course Performance</h2>
              {courses.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No courses to analyze yet!</p>
              ) : courses.map((course, i) => {
                const colors = ['#6c63ff', '#48cfad', '#f7b731', '#fc5c7d'];
                const color = colors[i % colors.length];
                const maxStudents = Math.max(...courses.map(c => c.enrolledCount || 0), 1);
                const percentage = Math.round(((course.enrolledCount || 0) / maxStudents) * 100);
                return (
                  <div key={i} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', color: '#e0e6f0', fontWeight: '600' }}>{course.title}</span>
                      <span style={{ fontSize: '14px', color, fontWeight: '700' }}>{course.enrolledCount} students</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', height: '8px' }}>
                      <div style={{ background: `linear-gradient(90deg, ${color}, ${color}88)`, width: `${percentage}%`, height: '8px', borderRadius: '10px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Course Chat Popup */}
      {activeChat && (
        <CourseChat
          courseId={activeChat}
          courseName={courses.find(c => c._id?.toString() === activeChat)?.title || 'Course Discussion'}
          user={user}
          socket={socket}
          onClose={() => setActiveChat(null)}
        />
      )}

    </div>
  );
}

export default InstructorDashboard;