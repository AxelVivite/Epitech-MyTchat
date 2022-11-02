import React from 'react';

interface TextDateProps {
    children: string;
    className?: string;
}

function TextDate(props: TextDateProps) {
  return (
    <p className={`date ${props.className}`}>
      {props.children}
    </p>
  );
}

export default TextDate;
