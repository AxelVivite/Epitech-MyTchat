import React from 'react';

import MuiIconButton from '@mui/material/IconButton';

type IconButtonVariant = 'transparent' | 'primary' | 'outlined';

type IconButtonType = 'button' | 'submit' | 'reset';

const IconButton = function IconButton(
  children: React.ReactElement<unknown, string> | undefined,
  className: string | undefined,
  onClick: () => void | undefined,
  onKeyDown: () => void | undefined,
  variant: IconButtonVariant,
  type: IconButtonType,
): React.ReactElement<unknown, string> | null {
  return (
    <MuiIconButton
      className={`icon-btn--${variant} ${className}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      size="small"
      sx={{ m: 'none' }}
      type={type}
    >
      {children}
    </MuiIconButton>
  );
};

export default IconButton;
