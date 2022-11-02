import React from 'react';

type TextVariant = 'name'

interface TextProps {
    children: string;
    className?: string;
    variant?: TextVariant;
}

function Text(props: TextProps) {
  return (
    <p className={`${(props.variant && `text--${props.variant}`) || 'text'} ${props.className}`}>
      {props.children}
    </p>
  );
}

export default Text;
