import React from 'react';

type TitleVariant = 'header' | 'room';

const Title = function Title(
  children: string,
  className: string | undefined,
  variant: TitleVariant,
): React.ReactElement<unknown, string> | null {
  return (
    <p className={`title--${variant} ${className}`}>
      {children}
    </p>
  );
};

export default Title;
