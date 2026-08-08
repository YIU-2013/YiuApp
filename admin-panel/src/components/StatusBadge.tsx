export default function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`status-badge ${active ? 'status-badge--active' : 'status-badge--inactive'}`}>
      {active ? 'Aktif' : 'Pasif'}
    </span>
  );
}
