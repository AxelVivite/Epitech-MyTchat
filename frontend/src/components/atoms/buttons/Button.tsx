import React from 'react';

type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
    children?: JSX.Element | string;
    className?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    type: ButtonType;
    hidden?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button
      className={`${props.className} ${props.hidden && 'btn--hidden'}`}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      type={props.type}
    >
      {props.children}
    </button>
  );
}

export default Button;
