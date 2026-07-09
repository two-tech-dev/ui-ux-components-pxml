import * as React from 'react';

export interface ProductDetailProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function ProductDetail({ children, className, ...rest }: ProductDetailProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
