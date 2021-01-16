import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import Icon from './Icon';
import 'react-figma-plugin-ds/figma-plugin-ds.css';
import './ui.scss';

declare function require(path: string): any;

function sendToCode<T>(type: string, data?: T) {
  parent.postMessage({ pluginMessage: { type, data } }, '*');
}

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
        setNodes(nodes => nodes.filter(node => node.id !== data.nodeId));
      }
    });
  }, []);

  return (
    <div className="App">
      <div className="header">
        <span className="text">
          Choose a layer and double click to rename it.
        </span>
      </div>
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

  const handleFocus = () => {
    setTimeout(
      // @ts-ignore
      () => document.getElementsByName('name')[0].select(),
      5
    );
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

  useEffect(() => {
    if (selected) sendToCode('zoom-into-node', { nodeId: node.id });
  }, [selected]);

  return (
    <div
      onClick={onSelect}
      onDoubleClick={() => setIsEditing(true)}
      className={`Node ${selected ? 'selected' : ''}`}
    >
      <Icon type={node.type} className="Icon" />
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
            onFocus={handleFocus}
            onBlur={handleCancel}
            onKeyDown={handleKeyDown}
          />
        </form>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
