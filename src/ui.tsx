import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './ui.css';
import logo from './logo.svg';

declare function require(path: string): any;

const App = () => {
  const [textbox, setTextbox] = useState<HTMLInputElement>();
  const countRef = (e: HTMLInputElement) => {
    if (e) e.value = '5';
    setTextbox(e);
  };

  const onCreate = () => {
    const count = parseInt(textbox.value, 10);
    parent.postMessage(
      {
        pluginMessage: { type: 'create-rectangles', count },
      },
      '*'
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  return (
    <div>
      <img src={logo} />
      <h2>Rectangle Creator</h2>
      <p>
        Count: <input ref={countRef} />
      </p>
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
