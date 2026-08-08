import type { ReactNode } from 'react';

interface FormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
  children: ReactNode;
}

export default function FormModal({
  open,
  title,
  onClose,
  onSubmit,
  submitting,
  submitLabel = 'Kaydet',
  children,
}: FormModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="modal__body">
            <div className="form-grid">{children}</div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Vazgeç
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Kaydediliyor…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
