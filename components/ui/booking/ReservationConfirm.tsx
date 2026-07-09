import * as React from 'react';

export interface ReservationConfirmProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function ReservationConfirm({ children, className, ...rest }: ReservationConfirmProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
