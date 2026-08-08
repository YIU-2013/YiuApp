import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable, { type DataTableColumn } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ActionButton from '../components/ActionButton';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useCrudResource } from '../hooks/useCrudResource';
import { eventService } from '../services/eventService';
import type { Event } from '../types/models';

type FormState = Omit<Event, 'id'>;

const nowDate = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  location: '',
  eventDate: nowDate(),
  imageUrl: '',
  category: '',
  active: true,
};

export default function EventsPage() {
  const { data, isLoading, isError, error, refetch, create, update, remove, isMutating } =
    useCrudResource<Event>('events', eventService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);

  const rows = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...data]
      .filter((e) => showPastEvents || e.eventDate.slice(0, 10) >= today)
      .sort((a, b) => (a.eventDate < b.eventDate ? -1 : 1));
  }, [data, showPastEvents]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, eventDate: nowDate() });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: Event) => {
    setEditing(item);
    setForm({ ...item, eventDate: item.eventDate.slice(0, 10) });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Başlık zorunludur.';
    if (!form.location.trim()) next.location = 'Konum zorunludur.';
    if (!form.eventDate) next.eventDate = 'Etkinlik tarihi zorunludur.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload: FormState = { ...form, eventDate: new Date(form.eventDate).toISOString() };
    if (editing) {
      await update(editing.id, payload);
    } else {
      await create(payload);
    }
    setModalOpen(false);
  };

  const handleToggleActive = async (item: Event) => {
    await update(item.id, { active: !item.active });
  };

  const columns: DataTableColumn<Event>[] = [
    {
      key: 'title',
      header: 'Başlık',
      render: (row) => (
        <div>
          <div className="data-table__title">{row.title}</div>
          <div className="data-table__muted">{row.location}</div>
        </div>
      ),
    },
    {
      key: 'eventDate',
      header: 'Tarih',
      render: (row) => new Date(row.eventDate).toLocaleDateString('tr-TR'),
    },
    { key: 'category', header: 'Kategori', render: (row) => row.category && <span className="badge-pill">{row.category}</span> },
    { key: 'active', header: 'Durum', render: (row) => <StatusBadge active={row.active} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="data-table__actions">
          <ActionButton onClick={() => openEdit(row)}>Düzenle</ActionButton>
          <ActionButton onClick={() => handleToggleActive(row)}>
            {row.active ? 'Pasife Al' : 'Aktifleştir'}
          </ActionButton>
          <ActionButton variant="danger" onClick={() => setDeleteTarget(row)}>
            Sil
          </ActionButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Etkinlik Yönetimi"
        description="Mobil uygulamadaki etkinlik listesi"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Yeni Etkinlik
          </button>
        }
      />

      <div className="toolbar">
        <div className="field checkbox-field">
          <input
            id="show-past"
            type="checkbox"
            checked={showPastEvents}
            onChange={(e) => setShowPastEvents(e.target.checked)}
          />
          <label htmlFor="show-past">Geçmiş etkinlikleri de göster</label>
        </div>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error ?? 'Etkinlikler yüklenemedi.'} onRetry={() => refetch()} />}
      {!isLoading && !isError && rows.length === 0 && (
        <EmptyState title="Yaklaşan etkinlik yok" description="Yeni bir etkinlik eklemek için yukarıdaki butonu kullanın." />
      )}
      {!isLoading && !isError && rows.length > 0 && (
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? 'Etkinlik Düzenle' : 'Yeni Etkinlik'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={isMutating}
      >
        <div className="field">
          <label htmlFor="evt-title">Title</label>
          <input id="evt-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="evt-description">Description</label>
          <textarea
            id="evt-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="evt-location">Location</label>
            <input
              id="evt-location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            {errors.location && <span className="field-error">{errors.location}</span>}
          </div>
          <div className="field">
            <label htmlFor="evt-date">Event Date</label>
            <input
              id="evt-date"
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
            {errors.eventDate && <span className="field-error">{errors.eventDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="evt-image">Image URL</label>
            <input
              id="evt-image"
              value={form.imageUrl ?? ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="evt-category">Category</label>
            <input
              id="evt-category"
              value={form.category ?? ''}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
        </div>

        <div className="field checkbox-field">
          <input
            id="evt-active"
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <label htmlFor="evt-active">Active</label>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Etkinliği sil"
        message={`"${deleteTarget?.title}" kalıcı olarak silinecek. Emin misin?`}
        confirmLabel="Sil"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await remove(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
