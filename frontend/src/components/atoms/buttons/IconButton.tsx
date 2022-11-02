import React from 'react';

import { default as MuiIconButton } from '@mui/material/IconButton';

type IconButtonVariant = 'transparent' | 'primary' | 'outlined';

type IconButtonType = 'button' | 'submit' | 'reset';

interface IconButtonProps {
    children?: JSX.Element;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    variant: IconButtonVariant;
    type: IconButtonType;
}

function IconButton(props: IconButtonProps) {
  return (
    <MuiIconButton
      className={`icon-btn--${props.variant} ${props.className}`}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      size="small"
      sx={{ m: 'none' }}
      type={props.type}
    >
      {props.children}
    </MuiIconButton>
  );
}

export default IconButton;
