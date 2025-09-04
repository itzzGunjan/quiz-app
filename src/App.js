import React, { useState, useEffect } from 'react';

// Inline styles to replace Tailwind CSS
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '2rem',
    maxWidth: '32rem',
    width: '100%',
    textAlign: 'center'
  },
  quizCard: {
    maxWidth: '48rem',
    width: '100%'
  },
  resultsCard: {
    maxWidth: '64rem',
    width: '100%'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '2rem'
  },
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s'
  },
  buttonHover: {
    backgroundColor: '#2563eb'
  },
  buttonDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed'
  },
  select: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem'
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  timerDanger: {
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '0.5rem',
    margin: '1rem 0'
  },
  progressFill: {
    backgroundColor: '#3b82f6',
    height: '0.5rem',
    borderRadius: '9999px',
    transition: 'width 0.3s'
  },
  question: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem'
  },
  option: {
    width: '100%',
    padding: '1rem',
    textAlign: 'left',
    borderRadius: '0.5rem',
    border: '2px solid #e5e7eb',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  optionHover: {
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff'
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
    color: '#065f46'
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
    color: '#991b1b'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280'
  },
  score: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    margin: '0.5rem 0'
  },
  percentage: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '1rem'
  },
  resultItem: {
    padding: '1rem',
    borderRadius: '0.5rem',
    borderLeft: '4px solid',
    marginBottom: '1rem',
    textAlign: 'left'
  },
  resultCorrect: {
    borderLeftColor: '#10b981',
    backgroundColor: '#ecfdf5'
  },
  resultIncorrect: {
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2'
  },
  loading: {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  error: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#991b1b',
    fontSize: '0.875rem'
  }
};

// Add CSS animation for loading spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

// API helper functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const fetchQuestionsFromAPI = async (amount = 8, difficulty = '') => {
  try {
    const difficultyParam = difficulty && difficulty !== 'all' ? `&difficulty=${difficulty}` : '';
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple${difficultyParam}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    
    const data = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('No questions available for this difficulty');
    }
    
    return data.results.map((q, index) => {
      const options = shuffleArray([...q.incorrect_answers, q.correct_answer]);
      const correctIndex = options.indexOf(q.correct_answer);
      
      return {
        id: index + 1,
        question: decodeHtml(q.question),
        options: options.map(option => decodeHtml(option)),
        correct: correctIndex,
        difficulty: q.difficulty
      };
    });
  } catch (error) {
    throw error;
  }
};

// Fallback questions in case API fails
const fallbackQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    difficulty: "easy"
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correct: 1,
    difficulty: "medium"
  },
  {
    id: 4,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correct: 1,
    difficulty: "medium"
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
    difficulty: "hard"
  }
];

const QuizApp = () => {
  const [currentView, setCurrentView] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize quiz
  const startQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first
      const apiQuestions = await fetchQuestionsFromAPI(8, difficulty);
      setQuestions(apiQuestions);
    } catch (error) {
      console.warn('API failed, using fallback questions:', error.message);
      // Use fallback questions if API fails
      const filteredQuestions = difficulty === 'all' 
        ? fallbackQuestions 
        : fallbackQuestions.filter(q => q.difficulty === difficulty);
      
      if (filteredQuestions.length === 0) {
        setError('No questions available for selected difficulty');
        setIsLoading(false);
        return;
      }
      
      setQuestions(filteredQuestions);
    }
    
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setTimerActive(true);
    setCurrentView('quiz');
    setIsLoading(false);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0 && currentView === 'quiz') {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, currentView]);

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex);
      setTimerActive(false);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct;
    
    const answerData = {
      questionId: currentQ.id,
      question: currentQ.question,
      selectedAnswer: selectedAnswer,
      correctAnswer: currentQ.correct,
      options: currentQ.options,
      isCorrect: isCorrect
    };
    
    setUserAnswers(prev => [...prev, answerData]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setCurrentView('results');
      setTimerActive(false);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]?.selectedAnswer || null);
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    setCurrentView('start');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setTimerActive(false);
    setError(null);
  };

  // Start Screen
  if (currentView === 'start') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
            <h1 style={styles.title}>Quiz Challenge</h1>
            <p style={styles.subtitle}>Test your knowledge with questions from Open Trivia DB!</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Select Difficulty
            </label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            onClick={startQuiz}
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => !isLoading && Object.assign(e.target.style, styles.buttonHover)}
            onMouseOut={(e) => !isLoading && Object.assign(e.target.style, { backgroundColor: '#3b82f6' })}
          >
            {isLoading ? (
              <div style={styles.loading}></div>
            ) : (
              <>
                Start Quiz
                <span>→</span>
              </>
            )}
          </button>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (currentView === 'quiz' && questions.length > 0) {
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, ...styles.quizCard, textAlign: 'left' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div style={{
                ...styles.timer,
                ...(timeLeft <= 10 ? styles.timerDanger : {})
              }}>
                <span>⏰</span>
                <span>{timeLeft}s</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`
                }}
              ></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
              <span>Progress: {Math.round(progress)}%</span>
              <span>Score: {score}/{userAnswers.length}</span>
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={styles.question}>
              {currentQ.question}
            </h2>

            <div>
              {currentQ.options.map((option, index) => {
                let optionStyle = { ...styles.option };
                
                if (selectedAnswer === index) {
                  if (index === currentQ.correct) {
                    optionStyle = { ...optionStyle, ...styles.optionCorrect };
                  } else {
                    optionStyle = { ...optionStyle, ...styles.optionIncorrect };
                  }
                } else if (selectedAnswer !== null && index === currentQ.correct) {
                  optionStyle = { ...optionStyle, ...styles.optionCorrect };
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    style={optionStyle}
                    onMouseOver={(e) => {
                      if (selectedAnswer === null) {
                        Object.assign(e.target.style, styles.optionHover);
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedAnswer === null) {
                        Object.assign(e.target.style, styles.option);
                      }
                    }}
                  >
                    <span>{option}</span>
                    {selectedAnswer !== null && (
                      <>
                        {index === currentQ.correct && <span style={{ color: '#10b981' }}>✓</span>}
                        {selectedAnswer === index && index !== currentQ.correct && <span style={{ color: '#ef4444' }}>✗</span>}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div style={styles.navigation}>
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              style={{
                ...styles.navButton,
                ...(currentQuestion === 0 ? styles.buttonDisabled : {})
              }}
            >
              <span>←</span>
              Previous
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              style={{
                ...styles.button,
                width: 'auto',
                ...(selectedAnswer === null ? styles.buttonDisabled : {})
              }}
            >
              {currentQuestion + 1 === questions.length ? 'Finish' : 'Next'}
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentView === 'results') {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, ...styles.resultsCard }}>
          {/* Results Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {percentage >= 70 ? '🏆' : percentage >= 50 ? '🥈' : '🥉'}
            </div>
            <h1 style={styles.title}>Quiz Complete!</h1>
            <div style={styles.score}>
              {score}/{questions.length}
            </div>
            <div style={styles.percentage}>
              {percentage}% Correct
            </div>
            <div style={{ fontSize: '1.125rem', color: '#374151' }}>
              {percentage >= 80 ? 'Excellent work!' : 
               percentage >= 60 ? 'Good job!' : 
               'Keep practicing!'}
            </div>
          </div>

          {/* Detailed Results */}
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Detailed Results</h2>
            <div>
              {userAnswers.map((answer, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.resultItem,
                    ...(answer.isCorrect ? styles.resultCorrect : styles.resultIncorrect)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Question {index + 1}: {answer.question}
                    </h3>
                    <span style={{ marginLeft: '1rem' }}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                    <p style={{ margin: '0.25rem 0' }}>
                      <span style={{ fontWeight: '500' }}>Your answer:</span> {' '}
                      <span style={{ color: answer.isCorrect ? '#065f46' : '#991b1b' }}>
                        {answer.selectedAnswer !== null ? answer.options[answer.selectedAnswer] : 'No answer selected'}
                      </span>
                    </p>
                    {!answer.isCorrect && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <span style={{ fontWeight: '500' }}>Correct answer:</span> {' '}
                        <span style={{ color: '#065f46' }}>
                          {answer.options[answer.correctAnswer]}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restart Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={restartQuiz}
              style={{ ...styles.button, width: 'auto' }}
            >
              <span>↻</span>
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default QuizApp;