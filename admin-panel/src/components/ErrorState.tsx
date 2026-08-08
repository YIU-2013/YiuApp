interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-block state-block--error">
      <strong>Bir şeyler ters gitti</strong>
      <small>{message}</small>
      {onRetry && (
        <div style={{ marginTop: 12 }}>
          <button type="button" className="btn btn--secondary btn--sm" onClick={onRetry}>
            Tekrar Dene
          </button>
        </div>
      )}
    </div>
  );
}
