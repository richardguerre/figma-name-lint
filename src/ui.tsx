import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon, Input, Text } from 'react-figma-plugin-ds';
import './ui.scss';

declare function require(path: string): any;

const App = () => {
  const [elements, setElements] = useState<SceneNode[]>([]);

  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'find-all-nodes',
        },
      },
      '*'
    );

    window.addEventListener('message', e => {
      const { type, data } = e.data.pluginMessage;
      if (type === 'found-nodes') {
        console.log('found nodes', data.nodes, e.data.pluginMessage);
        setElements(data.nodes);
      } else if (type === 'node-renamed') {
        setElements(el => el.filter(node => node.id !== data.nodeId));
      }
    });
  }, []);

  return (
    <div>
      <Text size="small">Choose an element and double click to rename it.</Text>
      {elements.map(node => (
        <Element key={node.id} node={node} />
      ))}
    </div>
  );
};

type ElementProps = {
  node: SceneNode;
};

const Element = ({ node }: ElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(node.name);

  const handleClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'zoom-into-node',
          data: {
            nodeId: node.id,
          },
        },
      },
      '*'
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = value !== '' || value !== node.name ? value : node.name;
    console.log(newName);
    parent.postMessage(
      {
        pluginMessage: {
          type: 'rename-node',
          data: {
            nodeId: node.id,
            newName,
          },
        },
      },
      '*'
    );
    setIsEditing(false);
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={() => setIsEditing(true)}
      className="Element"
    >
      <Icon name="frame"></Icon>
      {!isEditing ? (
        <Text>{node.name}</Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Rename it!"
            type="text"
            defaultValue={node.name}
            onChange={setValue}
          ></Input>
        </form>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
