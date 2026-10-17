import React from 'react';

interface BrandMarkProps {
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = '' }) => (
  <img
    src="/hireshield-logo.png"
    alt=""
    aria-hidden="true"
    className={`brand-mark ${className}`}
  />
);
