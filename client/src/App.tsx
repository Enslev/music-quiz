import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useAppState } from './overmind';

function App() {

  const state = useAppState();

  const clickButton = () => {
    window.location.href = 'http://localhost:9001/api/spotify/auth'
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello {state.name}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={clickButton}>Click me</button>
      </header>

    </div>
  );
}

export default App;
