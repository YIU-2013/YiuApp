export default function LoadingState({ label = 'Yükleniyor…' }: { label?: string }) {
  return <div className="state-block">{label}</div>;
}
