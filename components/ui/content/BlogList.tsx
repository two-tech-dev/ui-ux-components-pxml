import * as React from 'react';

export interface BlogListProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function BlogList({ children, className, ...rest }: BlogListProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
