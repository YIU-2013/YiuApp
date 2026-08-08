import { useState } from 'react';
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
import { announcementService } from '../services/announcementService';
import type { Announcement, AnnouncementCategory } from '../types/models';

const CATEGORIES: AnnouncementCategory[] = ['AKADEMİK', 'ÖNEMLİ', 'DUYURU'];

type FormState = Omit<Announcement, 'id'>;

const EMPTY_FORM: FormState = {
  title: '',
  summary: '',
  content: '',
  category: 'DUYURU',
  imageUrl: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  pinned: false,
  active: true,
};

export default function AnnouncementsPage() {
  const { data, isLoading, isError, error, refetch, create, update, remove, isMutating } =
    useCrudResource<Announcement>('announcements', announcementService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const rows = [...data].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || (a.publishedAt < b.publishedAt ? 1 : -1),
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, publishedAt: new Date().toISOString().slice(0, 10) });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: Announcement) => {
    setEditing(item);
    setForm({ ...item, publishedAt: item.publishedAt.slice(0, 10) });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Başlık zorunludur.';
    if (!form.summary.trim()) next.summary = 'Özet zorunludur.';
    if (!form.content.trim()) next.content = 'İçerik zorunludur.';
    if (!form.publishedAt) next.publishedAt = 'Yayın tarihi zorunludur.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload: FormState = { ...form, publishedAt: new Date(form.publishedAt).toISOString() };
    if (editing) {
      await update(editing.id, payload);
    } else {
      await create(payload);
    }
    setModalOpen(false);
  };

  const handleToggleActive = async (item: Announcement) => {
    await update(item.id, { active: !item.active });
  };

  const columns: DataTableColumn<Announcement>[] = [
    {
      key: 'title',
      header: 'Başlık',
      render: (row) => (
        <div>
          <div className="data-table__title" title={row.title}>
            {row.pinned && '📌 '}
            {row.title}
          </div>
          <div className="data-table__muted" title={row.summary}>{row.summary}</div>
        </div>
      ),
    },
    { key: 'category', header: 'Kategori', render: (row) => <span className="badge-pill">{row.category}</span> },
    {
      key: 'publishedAt',
      header: 'Yayın Tarihi',
      render: (row) => new Date(row.publishedAt).toLocaleDateString('tr-TR'),
    },
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
        title="Duyuru Yönetimi"
        description="Mobil uygulamadaki duyuru listesi"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Yeni Duyuru
          </button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error ?? 'Duyurular yüklenemedi.'} onRetry={() => refetch()} />}
      {!isLoading && !isError && rows.length === 0 && (
        <EmptyState title="Henüz duyuru yok" description="İlk duyuruyu eklemek için yukarıdaki butonu kullanın." />
      )}
      {!isLoading && !isError && rows.length > 0 && (
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? 'Duyuru Düzenle' : 'Yeni Duyuru'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={isMutating}
      >
        <div className="field">
          <label htmlFor="ann-title">Başlık</label>
          <input id="ann-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="ann-summary">Özet</label>
          <textarea
            id="ann-summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          {errors.summary && <span className="field-error">{errors.summary}</span>}
        </div>

        <div className="field">
          <label htmlFor="ann-content">İçerik</label>
          <textarea
            id="ann-content"
            style={{ minHeight: 110 }}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          {errors.content && <span className="field-error">{errors.content}</span>}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="ann-category">Kategori</label>
            <select
              id="ann-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as AnnouncementCategory })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ann-image">Görsel URL</label>
            <input
              id="ann-image"
              value={form.imageUrl ?? ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="ann-published">Yayın Tarihi</label>
            <input
              id="ann-published"
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
            />
            {errors.publishedAt && <span className="field-error">{errors.publishedAt}</span>}
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 20 }}>
            <div className="field checkbox-field">
              <input
                id="ann-pinned"
                type="checkbox"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              />
              <label htmlFor="ann-pinned">Sabitlenmiş</label>
            </div>
            <div className="field checkbox-field">
              <input
                id="ann-active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <label htmlFor="ann-active">Aktif</label>
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Duyuruyu sil"
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
