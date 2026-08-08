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
import { campusService } from '../services/campusService';
import type { CampusContent } from '../types/models';

const EXAMPLE_CATEGORIES = ['Kütüphane', 'Yemekhane', 'Kulüpler', 'Ulaşım', 'Sosyal Alanlar'];

type FormState = Omit<CampusContent, 'id'>;

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  icon: '',
  category: EXAMPLE_CATEGORIES[0],
  sortOrder: 1,
  active: true,
};

export default function CampusContentsPage() {
  const { data, isLoading, isError, error, refetch, create, update, remove, isMutating } =
    useCrudResource<CampusContent>('campus-contents', campusService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CampusContent | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<CampusContent | null>(null);

  const rows = useMemo(() => [...data].sort((a, b) => a.sortOrder - b.sortOrder), [data]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: CampusContent) => {
    setEditing(item);
    setForm({ ...item });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Başlık zorunludur.';
    if (!form.description.trim()) next.description = 'Açıklama zorunludur.';
    if (!form.icon.trim()) next.icon = 'Icon adı zorunludur.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (editing) {
      await update(editing.id, form);
    } else {
      await create(form);
    }
    setModalOpen(false);
  };

  const handleToggleActive = async (item: CampusContent) => {
    await update(item.id, { active: !item.active });
  };

  const columns: DataTableColumn<CampusContent>[] = [
    {
      key: 'title',
      header: 'Başlık',
      render: (row) => (
        <div>
          <div className="data-table__title" title={row.title}>{row.title}</div>
          <div className="data-table__muted" title={row.description}>{row.description}</div>
        </div>
      ),
    },
    { key: 'category', header: 'Kategori', render: (row) => <span className="badge-pill">{row.category}</span> },
    { key: 'icon', header: 'Icon', render: (row) => <code>{row.icon}</code> },
    { key: 'sortOrder', header: 'Sıra', render: (row) => row.sortOrder },
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
        title="Kampüs İçerikleri"
        description="Mobil uygulamadaki Kampüsüm ekranı içerikleri"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Yeni İçerik
          </button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error ?? 'Kampüs içerikleri yüklenemedi.'} onRetry={() => refetch()} />}
      {!isLoading && !isError && rows.length === 0 && (
        <EmptyState title="Henüz içerik yok" description="İlk kampüs içeriğini eklemek için yukarıdaki butonu kullanın." />
      )}
      {!isLoading && !isError && rows.length > 0 && (
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? 'İçerik Düzenle' : 'Yeni Kampüs İçeriği'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={isMutating}
      >
        <div className="field">
          <label htmlFor="camp-title">Başlık</label>
          <input id="camp-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="camp-description">Açıklama</label>
          <textarea
            id="camp-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="camp-icon">Icon (Ionicons adı)</label>
            <input
              id="camp-icon"
              placeholder="örn. library-outline"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
            {errors.icon && <span className="field-error">{errors.icon}</span>}
          </div>
          <div className="field">
            <label htmlFor="camp-category">Kategori</label>
            <input
              id="camp-category"
              list="camp-category-suggestions"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <datalist id="camp-category-suggestions">
              {EXAMPLE_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="camp-sort">Sıra Numarası</label>
            <input
              id="camp-sort"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div className="field checkbox-field" style={{ alignSelf: 'end', paddingBottom: 8 }}>
            <input
              id="camp-active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <label htmlFor="camp-active">Aktif</label>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="İçeriği sil"
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
