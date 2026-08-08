interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="state-block">
      <strong>{title}</strong>
      {description && <small>{description}</small>}
    </div>
  );
}
