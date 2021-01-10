import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './ui.scss';
import logo from './logo.svg';
import { Title } from 'react-figma-plugin-ds';

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
      <Title size="xlarge" weight="bold">
        Name Lint
      </Title>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
