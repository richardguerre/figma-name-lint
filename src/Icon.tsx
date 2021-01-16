import React from 'react';
import slice from './icons/slice.svg';
import frame from './icons/frame.svg';
import group from './icons/group.svg';
import component from './icons/component.svg';
import instance from './icons/instance.svg';
import booleanOp from './icons/union.svg';
import vector from './icons/vector.svg';
import star from './icons/star.svg';
import line from './icons/line.svg';
import ellipse from './icons/ellipse.svg';
import polygon from './icons/polygon.svg';
import rectangle from './icons/rectangle.svg';
import text from './icons/text.svg';

type Props = {
  className?: string;
  type:
    | 'SLICE'
    | 'FRAME'
    | 'GROUP'
    | 'COMPONENT'
    | 'INSTANCE'
    | 'BOOLEAN_OPERATION'
    | 'VECTOR'
    | 'STAR'
    | 'LINE'
    | 'ELLIPSE'
    | 'POLYGON'
    | 'RECTANGLE'
    | 'TEXT';
};

const Icon = ({ type, className }: Props) => {
  if (type === 'SLICE') return <img src={slice} className={className} />;
  if (type === 'FRAME') return <img src={frame} className={className} />;
  if (type === 'GROUP') return <img src={group} className={className} />;
  if (type === 'COMPONENT')
    return <img src={component} className={className} />;
  if (type === 'INSTANCE') return <img src={instance} className={className} />;
  if (type === 'BOOLEAN_OPERATION')
    return <img src={booleanOp} className={className} />;
  if (type === 'VECTOR') return <img src={vector} className={className} />;
  if (type === 'STAR') return <img src={star} className={className} />;
  if (type === 'LINE') return <img src={line} className={className} />;
  if (type === 'ELLIPSE') return <img src={ellipse} className={className} />;
  if (type === 'POLYGON') return <img src={polygon} className={className} />;
  if (type === 'RECTANGLE')
    return <img src={rectangle} className={className} />;
  if (type === 'TEXT') return <img src={text} className={className} />;
  return <img src={frame} className={className} />;
};

export default Icon;
