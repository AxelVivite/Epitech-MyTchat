import React from 'react';

type TextVariant = 'name'

const Text = function Text(
  children: string,
  className: string | undefined,
  variant: TextVariant | undefined,
): React.ReactElement<unknown, string> | null {
  return (
    <p className={`${(variant && `text--${variant}`) || 'text'} ${className}`}>
      {children}
    </p>
  );
};

export default Text;
