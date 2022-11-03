import React from 'react';

const Button = function Button(
  children: string | undefined,
  className: string | undefined,
  onClick: () => void | undefined,
  onKeyDown: () => void | undefined,
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  hidden: boolean | undefined,
): React.ReactElement<unknown, string> | null {
  return (
    <button
      className={`${className} ${hidden && 'btn--hidden'}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      type={type === 'submit' ? 'submit' : 'button'}
    >
      {children}
    </button>
  );
};

export default Button;
