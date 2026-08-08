import type { ReactNode } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  variant?: 'default' | 'danger';
  children: ReactNode;
}

export default function ActionButton({ onClick, variant = 'default', children }: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--sm ${variant === 'danger' ? 'btn--danger' : 'btn--secondary'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
