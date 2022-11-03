import React from 'react';

const defaultProps = {
  children: undefined,
  className: undefined,
  onClick: undefined,
  onKeyDown: undefined,
  hidden: undefined,
};

interface ButtonProps {
  children?: string,
  className?: string,
  onClick?: () => void,
  onKeyDown?: () => void,
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  hidden?: boolean,
}

const Button = function Button({
  children,
  className,
  onClick,
  onKeyDown,
  type,
  hidden,
}: ButtonProps) {
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

Button.defaultProps = defaultProps;

export default Button;
