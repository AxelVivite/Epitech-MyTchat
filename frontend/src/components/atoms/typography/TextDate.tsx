import React from 'react';

interface TextDateProps {
  children: string,
  className: string | undefined,
}

const TextDate = function TextDate({
  children,
  className,
}: TextDateProps) {
  return (
    <p className={`date ${className}`}>
      {children}
    </p>
  );
};

export default TextDate;
