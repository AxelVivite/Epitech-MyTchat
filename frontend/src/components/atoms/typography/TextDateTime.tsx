import React from 'react';

interface TextDateTimeProps {
  children: string,
  className: string | undefined,
}

const TextDateTime = function TextDateTime({
  children,
  className,
}: TextDateTimeProps) {
  return (
    <p className={`datetime ${className}`}>
      {children}
    </p>
  );
};

export default TextDateTime;
