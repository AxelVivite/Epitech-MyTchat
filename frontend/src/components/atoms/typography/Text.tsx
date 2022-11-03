import React from 'react';

type TextVariant = 'name' | ''

const defaultProps = {
  className: undefined,
  variant: undefined,
};

interface TextProps {
  children: string,
  className?: string,
  variant?: TextVariant,
}

const Text = function Text({
  children,
  className,
  variant,
}: TextProps) {
  return (
    <p className={`${(variant && `text--${variant}`) || 'text'} ${className}`}>
      {children}
    </p>
  );
};

Text.defaultProps = defaultProps;

export default Text;
