import * as React from 'react';

export interface ForumTopicProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function ForumTopic({ children, className, ...rest }: ForumTopicProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
