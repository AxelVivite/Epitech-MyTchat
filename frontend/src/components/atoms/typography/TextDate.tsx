import React from 'react';

const TextDate = function TextDate(
  children: string,
  className: string | undefined,
): React.ReactElement<unknown, string> | null {
  return (
    <p className={`date ${className}`}>
      {children}
    </p>
  );
};

export default TextDate;
