// App.jsx
import React, { useState, useEffect } from 'react';
import './App.scss';
import './App.css';

const buttons = [
  'C', 'DEL', '%', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '=', 'Ans',
  '√', 'x²', 'π', 'sin', 'cos', 'tan', 'log', 'ln'
];

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);
  const [ans, setAns] = useState('');

  // Load theme and history
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    if (storedTheme) setTheme(storedTheme);
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      const validKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','%'];

      if (validKeys.includes(key)) {
        playSound();
        setInput(prev => prev + key);
      } else if (key === 'Enter') {
        playSound();
        calculate();
      } else if (key === 'Backspace') {
        playSound();
        setInput(prev => prev.slice(0, -1));
      } else if (key === 'Escape') {
        playSound();
        setInput('');
        setResult('');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const playSound = () => {
    const audio = new Audio("https://www.soundjay.com/button/sounds/button-16.mp3");
    audio.volume = 0.1;
    audio.play();
  };

  const calculate = () => {
    try {
      let expression = input.replace('%', '/100')
                             .replace(/π/g, Math.PI)
                             .replace(/√/g, 'Math.sqrt')
                             .replace(/x²/g, '**2')
                             .replace(/sin/g, 'Math.sin')
                             .replace(/cos/g, 'Math.cos')
                             .replace(/tan/g, 'Math.tan')
                             .replace(/log/g, 'Math.log10')
                             .replace(/ln/g, 'Math.log');

      let evalResult = eval(expression);
      setResult(evalResult);
      setAns(evalResult);
      const newHistory = [...history, { input, result: evalResult }];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));
    } catch {
      setResult('Error');
    }
  };

  const handleClick = (value) => {
    playSound();
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else if (value === '=') {
      calculate();
    } else if (value === 'Ans') {
      setInput(input + ans);
    } else {
      setInput(input + value);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <div className="theme-toggle">
        <button onClick={toggleTheme}>{theme === 'light' ? '🌙 Dark' : '☀️ Light'}</button>
      </div>
      <div className="calculator">
        <div className="display">
          <div className="input" style={{ overflowX: 'auto' }}>{input || '0'}</div>
          <div className="result">{result !== '' ? result : ''}</div>
        </div>
        <div className="buttons">
          {buttons.map((btn, i) => (
            <button
              key={i}
              className={`btn ${btn === '=' ? 'equal' : ''}`}
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
        <div className="history">
          <h4>History</h4>
          <ul>
            {history.slice(-5).reverse().map((item, index) => (
              <li key={index}>
                <span>{item.input}</span> = <strong>{item.result}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
