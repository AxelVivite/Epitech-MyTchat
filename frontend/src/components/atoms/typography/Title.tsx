import React from 'react';

type TitleVariant = 'header' | 'room';

interface TitleProps {
  children: string,
  className: string | undefined,
  variant: TitleVariant,
}

const Title = function Title({
  children,
  className,
  variant,
}: TitleProps) {
  return (
    <p className={`title--${variant} ${className}`}>
      {children}
    </p>
  );
};

export default Title;
