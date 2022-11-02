import React from 'react';

type TitleVariant = 'header' | 'room';

interface TitleProps {
    children: string;
    className?: string;
    variant: TitleVariant;
}

function Title(props: TitleProps) {
  return (
    <p className={`title--${props.variant} ${props.className}`}>
      {props.children}
    </p>
  );
}

export default Title;
