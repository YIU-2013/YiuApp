interface PagePlaceholderProps {
  title: string;
  description: string;
}

/**
 * Faz-3'te gerçek CRUD ekranlarıyla değiştirilecek geçici sayfa gövdesi.
 * Şu an tek amacı: route yapısının ve layout'un çalıştığını göstermek.
 */
export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="page-placeholder">
      <h1>{title}</h1>
      <p>{description}</p>
      <span className="page-placeholder__badge">Yakında — Faz 3</span>
    </div>
  );
}
