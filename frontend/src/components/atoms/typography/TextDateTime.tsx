import React from 'react';

interface TextDateTimeProps {
    children: string;
    className?: string;
}

function TextDateTime(props: TextDateTimeProps) {
  return (
    <p className={`datetime ${props.className}`}>
      {props.children}
    </p>
  );
}

export default TextDateTime;
