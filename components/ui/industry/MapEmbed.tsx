import * as React from 'react';

export interface MapEmbedProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function MapEmbed({ children, className, ...rest }: MapEmbedProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
