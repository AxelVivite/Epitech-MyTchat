import React from 'react';

import MuiIconButton from '@mui/material/IconButton';

type IconButtonVariant = 'transparent' | 'primary' | 'outlined';

type IconButtonType = 'button' | 'submit' | 'reset';

const defaultProps = {
  children: undefined,
  className: undefined,
  onClick: undefined,
  onKeyDown: undefined,
};

interface IconButtonProps {
  children?: React.ReactElement,
  className?: string,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>
    | React.KeyboardEvent<HTMLButtonElement>) => void,
  onKeyDown?: (event: React.MouseEvent<HTMLButtonElement>
    | React.KeyboardEvent<HTMLButtonElement>) => void,
  variant: IconButtonVariant,
  type: IconButtonType,
}

const IconButton = function IconButton({
  children,
  className,
  onClick,
  onKeyDown,
  variant,
  type,
}: IconButtonProps) {
  return (
    <MuiIconButton
      className={`icon-btn--${variant} ${className}`}
      onClick={(event) => onClick && onClick(event)}
      onKeyDown={(event) => onKeyDown && onKeyDown(event)}
      size="small"
      sx={{ m: 'none' }}
      type={type}
    >
      {children}
    </MuiIconButton>
  );
};

IconButton.defaultProps = defaultProps;

export default IconButton;
