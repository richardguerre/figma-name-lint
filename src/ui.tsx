import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { Icon, Text } from 'react-figma-plugin-ds';
import 'react-figma-plugin-ds/figma-plugin-ds.css';
import './ui.scss';

declare function require(path: string): any;

const App = () => {
  const [nodes, setNodes] = useState<SceneNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>();

  const handleSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  useEffect(() => {
    sendToCode('find-all-nodes');

    window.addEventListener('message', e => {
      const { type, data } = e.data.pluginMessage;
      if (type === 'found-nodes') {
        setNodes(data.nodes);
      } else if (type === 'node-renamed') {
        setNodes(el => el.filter(node => node.id !== data.nodeId));
      }
    });
  }, []);

  return (
    <div className="App">
      <Text size="small">Choose a layer and double click to rename it.</Text>
      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          selected={node.id === selectedNodeId}
          onSelect={() => handleSelect(node.id)}
        />
      ))}
    </div>
  );
};

type FormValues = {
  name: string;
};

type NodeProps = {
  node: SceneNode;
  selected: boolean;
  onSelect: () => void;
};

const Node = ({ node, selected, onSelect }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: node.name },
  });

  const handleClick = () => {
    onSelect();
    sendToCode('zoom-into-node', { nodeId: node.id });
  };

  const onSubmit = (v: FormValues) => {
    const newName = v.name !== '' || v.name !== node.name ? v.name : node.name;
    sendToCode('rename-node', { nodeId: node.id, newName });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={() => setIsEditing(true)}
      className={`Node ${selected ? 'selected' : ''}`}
    >
      <Icon name="frame" className="Icon" />
      {!isEditing ? (
        <span className="nameText">{node.name}</span>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            name="name"
            className="nameInput"
            type="text"
            placeholder="Rename it!"
            autoFocus
            ref={register}
            onBlur={handleCancel}
            onKeyDown={handleKeyDown}
          />
        </form>
      )}
    </div>
  );
};

function sendToCode<T>(type: string, data?: T) {
  parent.postMessage({ pluginMessage: { type, data } }, '*');
}

ReactDOM.render(<App />, document.getElementById('react-page'));
