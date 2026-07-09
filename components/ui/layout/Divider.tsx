import * as React from 'react';

export interface DividerProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function Divider({ children, className, ...rest }: DividerProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
