import React from 'react';

const TextDateTime = function TextDateTime(
  children: string,
  className: string | undefined,
): React.ReactElement<unknown, string> | null {
  return (
    <p className={`datetime ${className}`}>
      {children}
    </p>
  );
};

export default TextDateTime;
