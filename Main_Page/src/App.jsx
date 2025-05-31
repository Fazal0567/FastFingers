import { useState, useEffect, useRef } from "react";

const App = () => {
  const [text, setText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [inputWords, setInputWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const inputRef = useRef(null);

  // Multiple sample texts for variety
  const sampleTexts = [
    // Short sentences
    "Code every day.",
    "Type without looking.",
    "Debug with patience.",
    "Learn keyboard shortcuts.",
    "Practice builds speed.",
    "Read error messages carefully.",
    "Refactor often.",
    "Keep functions small.",
    "Use meaningful names.",
    "Stay consistent.",

    // Longer paragraphs
    "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter in the English alphabet, making it ideal for typing practice. Repeating it helps build muscle memory for key positions and improves rhythm.",

    "Programming is more about problem-solving than syntax. When stuck, break the task into smaller steps, research incrementally, and test each part. This approach reduces frustration and leads to cleaner solutions over time.",

    "Touch typing efficiently requires discipline. Start by mastering the home row keys, then gradually expand to symbols and numbers. Speed will follow naturally once accuracy becomes second nature—no shortcuts exist.",

    "Clean code is like a well-organized book. Variables should read like clear nouns, functions like strong verbs, and comments like footnotes (used sparingly). Future maintainers will thank you for the clarity.",

    "Consistency trumps intensity in skill development. Fifteen minutes of daily typing practice yields better long-term results than a single weekly marathon session. Track your progress to stay motivated.",

    "Algorithms are the backbone of efficient software. Start with basic sorting and searching techniques, then explore recursion and dynamic programming. Real mastery comes from applying them to real projects, not just theory.",

    "Version control is non-negotiable. Commit small changes frequently, write descriptive messages, and branch early. Git proficiency saves hours of lost work and simplifies collaboration across teams.",

    "Keyboard shortcuts are productivity multipliers. Learn IDE navigation (e.g., jumping between files, searching symbols) and system commands (window management, clipboard history). The time saved compounds dramatically.",

    "Debugging is a detective game. Isolate the issue by replicating it, check inputs/outputs at each step, and question assumptions. The bug is often where you least expect it—stay methodical.",

    "Ergonomics matter for long typing sessions. Adjust chair height, keep wrists straight, and position monitors at eye level. Pain is a sign to rethink your setup before chronic issues develop."
  ];

  const [sampleText, setSampleText] = useState("");

  // Pick a random text at first load
  useEffect(() => {
    setSampleText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  }, []);

  const words = sampleText.split(" ");

  const startTest = () => {
    // Select a new random text before starting
    const newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setSampleText(newText);
    setIsRunning(true);
    setCompleted(false);
    setText("");
    setInputWords([]);
    setTimeElapsed(0);
    setStartTime(Date.now());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    const currentWord = words[inputWords.length];
    const typedWords = value.trim().split(" ");
    const lastWord = typedWords[typedWords.length - 1];

    if (value.endsWith(" ")) {
      if (inputWords.length < words.length) {
        setInputWords((prev) => [...prev, lastWord]);
        setText("");
      }

      // Check if all words are done
      if (inputWords.length + 1 === words.length) {
        calculateResults();
        setCompleted(true);
        setIsRunning(false);
      }
    }
  };

  const calculateResults = () => {
    const endTime = Date.now();
    const seconds = (endTime - startTime) / 1000;
    let correctCount = 0;

    inputWords.forEach((word, index) => {
      if (word === words[index]) {
        correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / inputWords.length) * 100) || 0;
    const wpm = Math.round((correctCount / seconds) * 60) || 0;

    setWpm(wpm);
    setAccuracy(accuracy);
    setTimeElapsed(Math.round(seconds));
  };

  useEffect(() => {
    if (isRunning && inputWords.length === 0 && text === "") {
      inputRef.current.focus();
    }
  }, [isRunning, inputWords, text]);

  const renderWords = () => {
    return words.map((word, index) => {
      let className = "word";
      if (index === inputWords.length && isRunning) {
        className += " current-word";
      }
      if (index < inputWords.length) {
        if (inputWords[index] === word) {
          className += " correct";
        } else {
          className += " incorrect";
        }
      }
      return (
        <span key={index} className={className}>
          {word}
        </span>
      );
    });
  };

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #111827;
          color: #d1d5db;
        }

        .container {
          max-width: 960px;
          width: 100%;
          padding: 2rem;
          margin: auto;
          border-radius: 1rem;
          background-color: #1f2937;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
        }

        h1 {
          text-align: center;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: white;
        }

        .words-container {
          height: 128px;
          overflow-y: auto;
          padding-right: 8px;
          line-height: 1.5;
          font-family: monospace;
          font-size: 1.1rem;
        }

        .word {
          display: inline-block;
          margin-right: 8px;
          margin-bottom: 4px;
        }

        .current-word {
          font-weight: bold;
          border-bottom: 2px solid #3b82f6;
        }

        .correct {
          color: #10b981;
        }

        .incorrect {
          color: #ef4444;
          text-decoration: line-through;
        }

        input[type="text"] {
          width: 100%;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 2px solid #374151;
          background-color: #374151;
          color: white;
          outline: none;
          font-size: 1rem;
          transition: border 0.2s ease;
        }

        input[type="text"]:focus {
          border-color: #3b82f6;
        }

        .button {
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .button:hover {
          background-color: #2563eb;
        }

        .timer {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #facc15;
          color: black;
          border-radius: 9999px;
          font-weight: 600;
        }

        .results {
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .stat-box {
          background-color: #22c55e;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .stat-box:hover {
          transform: scale(1.05);
        }

        .stat-box h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          color: white;
        }

        .stat-box p {
          font-size: 2rem;
          font-weight: bold;
          color: white;
        }

        .footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>

      <div className="container">
        <h1>Typing Speed Test</h1>

        {!completed ? (
          <>
            <div className="words-container">{renderWords()}</div>

            <div style={{ marginBottom: "1.5rem" }}>
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={handleInputChange}
                disabled={!isRunning}
                placeholder={isRunning ? "Start typing..." : "Click Start to begin"}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              {!isRunning ? (
                <button className="button" onClick={startTest}>
                  Start Test
                </button>
              ) : (
                <span className="timer">Time: {Math.floor(timeElapsed)}s</span>
              )}
            </div>
          </>
        ) : (
          <div className="results">
            <h2 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "1.5rem" }}>
              Test Completed!
            </h2>
            <div className="stats-grid">
              <div className="stat-box" style={{ backgroundColor: "#10b981" }}>
                <h3>WPM</h3>
                <p>{wpm}</p>
              </div>
              <div className="stat-box" style={{ backgroundColor: "#8b5cf6" }}>
                <h3>Accuracy</h3>
                <p>{accuracy}%</p>
              </div>
              <div className="stat-box" style={{ backgroundColor: "#3b82f6" }}>
                <h3>Time</h3>
                <p>{timeElapsed}s</p>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <button className="button" style={{ backgroundColor: "#6366f1" }} onClick={startTest}>
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="footer">
        </div>
      </div>
    </>
  );
};

export default App;