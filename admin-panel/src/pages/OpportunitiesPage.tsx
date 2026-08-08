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
import { opportunityService } from '../services/opportunityService';
import type { Opportunity, OpportunityCategory } from '../types/models';

const CATEGORIES: OpportunityCategory[] = ['İndirim', 'Kampüs Fırsatı', 'Anlaşmalı Kurum', 'Sosyal İmkan'];

type FormState = Omit<Opportunity, 'id'>;

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  category: 'İndirim',
  badge: '',
  imageUrl: '',
  actionLabel: '',
  actionUrl: '',
  active: true,
  sortOrder: 1,
};

export default function OpportunitiesPage() {
  const { data, isLoading, isError, error, refetch, create, update, remove, isMutating } =
    useCrudResource<Opportunity>('opportunities', opportunityService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);

  const rows = useMemo(() => [...data].sort((a, b) => a.sortOrder - b.sortOrder), [data]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: Opportunity) => {
    setEditing(item);
    setForm({ ...item });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Başlık zorunludur.';
    if (!form.description.trim()) next.description = 'Açıklama zorunludur.';
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

  const handleToggleActive = async (item: Opportunity) => {
    await update(item.id, { active: !item.active });
  };

  const columns: DataTableColumn<Opportunity>[] = [
    {
      key: 'title',
      header: 'Başlık',
      render: (row) => (
        <div>
          <div className="data-table__title">{row.title}</div>
          <div className="data-table__muted">{row.description}</div>
        </div>
      ),
    },
    { key: 'category', header: 'Kategori', render: (row) => <span className="badge-pill">{row.category}</span> },
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
        title="Fırsatlar Yönetimi"
        description="Mobil uygulamadaki YİÜ Ayrıcalıkları listesi"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Yeni Fırsat
          </button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error ?? 'Fırsatlar yüklenemedi.'} onRetry={() => refetch()} />}
      {!isLoading && !isError && rows.length === 0 && (
        <EmptyState title="Henüz fırsat yok" description="İlk fırsatı eklemek için yukarıdaki butonu kullanın." />
      )}
      {!isLoading && !isError && rows.length > 0 && (
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? 'Fırsat Düzenle' : 'Yeni Fırsat'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={isMutating}
      >
        <div className="field">
          <label htmlFor="opp-title">Title</label>
          <input id="opp-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="opp-description">Description</label>
          <textarea
            id="opp-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="opp-category">Category</label>
            <select
              id="opp-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as OpportunityCategory })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="opp-badge">Badge</label>
            <input
              id="opp-badge"
              value={form.badge ?? ''}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="opp-image">Image URL</label>
          <input
            id="opp-image"
            value={form.imageUrl ?? ''}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="opp-action-label">Action Label</label>
            <input
              id="opp-action-label"
              value={form.actionLabel ?? ''}
              onChange={(e) => setForm({ ...form, actionLabel: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="opp-action-url">Action URL</label>
            <input
              id="opp-action-url"
              value={form.actionUrl ?? ''}
              onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="opp-sort">Sort Order</label>
            <input
              id="opp-sort"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div className="field checkbox-field" style={{ alignSelf: 'end', paddingBottom: 8 }}>
            <input
              id="opp-active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <label htmlFor="opp-active">Active</label>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Fırsatı sil"
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
