import { useState, useEffect, useRef } from "react";

const App = () => {
  const [text, setText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [inputWords, setInputWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const inputRef = useRef(null);

  // Array of possible typing texts
 const sampleTexts = [
    "The quick brown fox jumps over the lazy dog, a sentence designed to test every letter on your keyboard. Repeating this pangram helps build muscle memory, ensuring your fingers learn the exact positions of each key without hesitation. Over time, your typing speed will increase as your brain automates the process, turning conscious effort into subconscious action. Consistency is crucial—daily practice, even for just ten minutes, yields better results than sporadic marathon sessions. Remember, accuracy first; speed follows naturally when the foundations are solid.",

    "Programming is an exercise in structured problem-solving, where breaking down complex tasks into smaller, manageable steps is the key to success. When faced with a bug, resist the urge to panic; instead, isolate the issue by testing each component individually and verifying inputs and outputs. Writing clean, modular code from the start saves countless hours of debugging later, as does thorough documentation of your thought process. Version control systems like Git are essential for tracking changes, collaborating with others, and reverting mistakes without losing progress. The best developers aren’t those who write code the fastest, but those who write maintainable, scalable solutions with foresight.",

    "Touch typing is a skill that transforms how you interact with technology, eliminating the need to look at the keyboard and freeing your mind to focus on ideas rather than mechanics. Begin by mastering the home row keys, then gradually introduce more keys, symbols, and numbers until your fingers move effortlessly across the entire keyboard. Speed drills and accuracy exercises should be balanced—typing too fast with errors reinforces bad habits, while typing too slowly limits progress. Over time, your fingers will develop muscle memory, allowing you to type without conscious thought, much like riding a bicycle. Regular practice, combined with proper posture and ergonomics, ensures sustainable improvement and prevents strain or injury.",

    "Debugging is as much an art as it is a science, requiring patience, logic, and a systematic approach to isolating issues. Start by reproducing the problem consistently, then narrow down the possible causes by examining variables, function outputs, and edge cases. Logging and breakpoints are invaluable tools for observing program behavior in real time, revealing discrepancies between expected and actual results. Often, the bug lies not in the complex algorithm but in a simple oversight, like an off-by-one error or a misplaced semicolon. Cultivating a mindset of curiosity rather than frustration turns debugging from a chore into a rewarding puzzle.",

    "Clean code is a hallmark of professional developers, characterized by readability, modularity, and thoughtful design. Meaningful variable names, concise functions with single responsibilities, and strategic comments make code self-documenting and easier to maintain. Avoid premature optimization; focus first on correctness and clarity, then refine performance where necessary. Code reviews and pair programming foster collaboration and catch potential issues early, while adherence to style guides ensures consistency across teams. Remember, you write code once but read it many times—invest the effort to make it understandable for your future self and others.",

    "Consistency is the backbone of skill mastery, whether in typing, coding, or any technical discipline. Short, daily practice sessions are far more effective than irregular, intense bursts, as they reinforce neural pathways and build habits incrementally. Track your progress with metrics like words per minute (WPM) or lines of bug-free code to stay motivated and identify areas for improvement. Embrace challenges as opportunities to grow, and don’t fear mistakes—they’re inevitable steps toward expertise. Over months and years, small efforts compound into significant achievements, turning beginners into experts through deliberate, sustained effort.",

    "Algorithms and data structures form the foundation of efficient software, enabling programs to handle large-scale data and complex operations gracefully. Start with basics like arrays, linked lists, and sorting algorithms, then progress to trees, graphs, and dynamic programming. Understanding time and space complexity helps you choose the right tool for each problem, optimizing performance without unnecessary overhead. Practical application is key: implement these concepts in projects, solve coding challenges, and analyze real-world systems to see them in action. Theoretical knowledge paired with hands-on experience transforms abstract concepts into intuitive problem-solving tools.",

    "Version control systems like Git are indispensable for modern development, safeguarding your work and enabling seamless collaboration. Commit small, logical changes frequently with descriptive messages, making it easier to track progress and revert if needed. Branching allows parallel experimentation without disrupting the main codebase, while pull requests facilitate code reviews and knowledge sharing. Mastering commands like rebase, cherry-pick, and stash unlocks advanced workflows, streamlining your development process. Treat Git not as an afterthought but as an integral part of your workflow, and it will repay you with efficiency and peace of mind.",

    "Keyboard shortcuts and tool mastery dramatically boost productivity, reducing reliance on mice and repetitive actions. Learn your IDE’s shortcuts for navigation, refactoring, and debugging to minimize context switching and keep focus on coding. System-level shortcuts for window management, clipboard history, and text expansion further accelerate workflows, saving hours over time. Customize your environment to fit your habits, removing friction from common tasks. The initial investment in learning these tools pays exponential dividends, turning tedious processes into effortless reflexes.",

    "Ergonomics is critical for sustaining long typing or coding sessions without physical strain. Adjust your chair, desk, and monitor height to maintain a neutral posture—wrists straight, shoulders relaxed, and eyes level with the screen. Take regular breaks to stretch and rest your eyes, following the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. Invest in a quality keyboard and mouse that support natural hand positions, preventing repetitive stress injuries. Prioritizing health ensures you can work productively for years without discomfort or long-term damage."
];

  const [sampleText, setSampleText] = useState("");

  // Pick a random text on load and before each test
  useEffect(() => {
    setSampleText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  }, []);

  const words = sampleText.split(" ");

  const startTest = () => {
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

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  useEffect(() => {
    if (isRunning && inputWords.length === 0 && text === "") {
      inputRef.current.focus();
    }
  }, [isRunning, inputWords, text]);

  const renderWords = () => {
  const wordsPerLine = 12; // Approximate number of words per line
  const lines = Math.ceil(words.length / wordsPerLine);
  const containerHeight = lines * 28; // ~28px per line

  // Set dynamic height for words container
  document.querySelector(".words-container")?.style.setProperty("height", `${containerHeight}px`);

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
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          max-width: 960px;
          width: 100%;
          padding: 2rem;
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
                <span className="timer">Time: {timeElapsed}s</span>
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

      </div>
    </>
  );
};

export default App;