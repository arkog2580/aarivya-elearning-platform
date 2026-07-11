import { useState, useEffect } from 'react';

function Quiz({ courseTitle, courseDescription, onSubmit }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Generate exactly 5 multiple choice questions for a course called "${courseTitle}". 
Course description: "${courseDescription}".

Return ONLY a JSON array with no extra text, no markdown, no backticks. Format:
[
  {
    "question": "question text here",
    "options": ["option A", "option B", "option C", "option D"],
    "answer": 0
  }
]

The "answer" field must be the index (0-3) of the correct option.
Make questions relevant to the course topic. Keep them clear and educational.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      const parsed = JSON.parse(text);
      setQuestions(parsed);
    } catch (err) {
      setError('Failed to generate questions. Using default questions.');
      setQuestions([
        {
          question: `What is the main topic of ${courseTitle}?`,
          options: ['Programming', 'Design', 'Marketing', 'Management'],
          answer: 0
        },
        {
          question: 'What is the best way to learn a new skill?',
          options: ['Practice regularly', 'Read once', 'Watch videos only', 'Skip basics'],
          answer: 0
        },
        {
          question: 'What does API stand for?',
          options: ['Application Programming Interface', 'Applied Program Integration', 'Automated Process Interface', 'Application Protocol Integration'],
          answer: 0
        },
        {
          question: 'Which is the most important aspect of software development?',
          options: ['Writing clean code', 'Working fast', 'Using latest tools', 'Copying code'],
          answer: 0
        },
        {
          question: 'What is the best practice for learning?',
          options: ['Consistent daily practice', 'Cramming all at once', 'Skipping difficult parts', 'Memorizing without understanding'],
          answer: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (current + 1 === questions.length) {
      const finalScore = newAnswers.reduce((sum, ans, i) =>
        ans === questions[i].answer ? sum + 1 : sum, 0
      );
      const percentage = Math.round((finalScore / questions.length) * 100);
      setScore(percentage);
      setFinished(true);
      onSubmit(percentage);
    } else {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  // Loading State
  if (loading) return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(108,99,255,0.25)',
      borderRadius: '20px', padding: '50px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '60px', height: '60px',
        border: '3px solid rgba(108,99,255,0.3)',
        borderTop: '3px solid #6c63ff',
        borderRadius: '50%', margin: '0 auto 20px',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#a78bfa', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
        🤖 AI is generating your quiz...
      </p>
      <p style={{ color: '#64748b', fontSize: '14px' }}>
        Creating personalized questions for {courseTitle}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // Finished State
  if (finished) {
    const passed = score >= 70;
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${passed ? 'rgba(72,207,173,0.3)' : 'rgba(252,92,125,0.3)'}`,
        borderRadius: '20px', padding: '40px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '60px', marginBottom: '20px' }}>
          {passed ? '🏆' : '📚'}
        </p>
        <h2 style={{
          fontSize: '28px', fontWeight: '800', marginBottom: '10px',
          color: passed ? '#48cfad' : '#fc5c7d'
        }}>
          {passed ? 'Congratulations! You Passed! 🎉' : 'Keep Learning! 💪'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '20px' }}>
          Your Score: <span style={{
            fontSize: '40px', fontWeight: '900',
            color: passed ? '#48cfad' : '#fc5c7d'
          }}>{score}%</span>
        </p>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>
          {passed
            ? '🎓 You scored 70%+ ! Your certificate is now available!'
            : '📖 You need 70%+ to pass. Review the course and try again!'}
        </p>
        {!passed && (
          <button
            onClick={() => {
              setCurrent(0);
              setSelected(null);
              setAnswers([]);
              setFinished(false);
              setScore(0);
              generateQuestions();
            }}
            style={{
              background: 'linear-gradient(135deg, #6c63ff, #48cfad)',
              color: 'white', border: 'none',
              padding: '12px 28px', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer'
            }}
          >
            Retry Quiz 🔄
          </button>
        )}
      </div>
    );
  }

  const q = questions[current];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(108,99,255,0.25)',
      borderRadius: '20px', padding: '35px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{
            color: '#6c63ff', fontSize: '13px',
            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            🤖 AI Generated Quiz — {courseTitle}
          </span>
          <span style={{ color: '#64748b', fontSize: '13px' }}>
            {current + 1} / {questions.length}
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', height: '6px' }}>
          <div style={{
            background: 'linear-gradient(90deg, #6c63ff, #48cfad)',
            width: `${((current + 1) / questions.length) * 100}%`,
            height: '6px', borderRadius: '10px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Question */}
      <h3 style={{
        fontSize: '20px', fontWeight: '700',
        color: '#e0e6f0', marginBottom: '25px', lineHeight: '1.5'
      }}>
        {q.question}
      </h3>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
        {q.options.map((option, idx) => {
          let borderColor = 'rgba(255,255,255,0.08)';
          let bgColor = 'rgba(255,255,255,0.03)';
          let textColor = '#94a3b8';

          if (selected !== null) {
            if (idx === q.answer) {
              borderColor = 'rgba(72,207,173,0.5)';
              bgColor = 'rgba(72,207,173,0.1)';
              textColor = '#48cfad';
            } else if (idx === selected && selected !== q.answer) {
              borderColor = 'rgba(252,92,125,0.5)';
              bgColor = 'rgba(252,92,125,0.1)';
              textColor = '#fc5c7d';
            }
          } else if (selected === idx) {
            borderColor = 'rgba(108,99,255,0.5)';
            bgColor = 'rgba(108,99,255,0.1)';
            textColor = '#a78bfa';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                padding: '16px 20px',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px', color: textColor,
                fontSize: '15px', fontWeight: '600',
                textAlign: 'left',
                cursor: selected !== null ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}
            >
              <span style={{
                width: '28px', height: '28px',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px', fontWeight: '800', flexShrink: 0
              }}>
                {selected !== null
                  ? idx === q.answer ? '✓' : idx === selected ? '✗' : ['A','B','C','D'][idx]
                  : ['A','B','C','D'][idx]
                }
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={selected === null}
        style={{
          width: '100%', padding: '14px',
          background: selected !== null
            ? 'linear-gradient(135deg, #6c63ff, #48cfad)'
            : 'rgba(255,255,255,0.05)',
          color: selected !== null ? 'white' : '#475569',
          border: 'none', borderRadius: '12px',
          fontSize: '16px', fontWeight: '700',
          cursor: selected !== null ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease'
        }}
      >
        {current + 1 === questions.length ? 'Submit Quiz 🎯' : 'Next Question →'}
      </button>
    </div>
  );
}

export default Quiz;