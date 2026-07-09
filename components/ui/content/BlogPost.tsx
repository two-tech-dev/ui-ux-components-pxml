import * as React from 'react';

export interface BlogPostProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function BlogPost({ children, className, ...rest }: BlogPostProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
