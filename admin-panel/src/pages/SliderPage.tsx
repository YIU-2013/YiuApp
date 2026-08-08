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
import { featuredSlideService } from '../services/featuredSlideService';
import type { FeaturedSlide, FeaturedSlideType } from '../types/models';

const SLIDE_TYPES: FeaturedSlideType[] = ['announcement', 'opportunity', 'event', 'campus'];

type FormState = Omit<FeaturedSlide, 'id'>;

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  badge: '',
  type: 'announcement',
  ctaLabel: '',
  imageUrl: '',
  targetType: undefined,
  targetId: '',
  sortOrder: 1,
  active: true,
  startsAt: '',
  endsAt: '',
};

export default function SliderPage() {
  const { data, isLoading, isError, error, refetch, create, update, remove, isMutating } =
    useCrudResource<FeaturedSlide>('featured-slides', featuredSlideService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FeaturedSlide | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<FeaturedSlide | null>(null);

  const sortedRows = useMemo(() => [...data].sort((a, b) => a.sortOrder - b.sortOrder), [data]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (slide: FeaturedSlide) => {
    setEditing(slide);
    setForm({ ...slide });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Başlık zorunludur.';
    if (!form.description.trim()) next.description = 'Açıklama zorunludur.';
    if (!Number.isFinite(form.sortOrder)) next.sortOrder = 'Sıra numarası geçerli olmalıdır.';
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

  const handleToggleActive = async (slide: FeaturedSlide) => {
    await update(slide.id, { active: !slide.active });
  };

  const columns: DataTableColumn<FeaturedSlide>[] = [
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
    { key: 'type', header: 'Tip', render: (row) => <span className="badge-pill">{row.type}</span> },
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
        title="Slider Yönetimi"
        description="Ana sayfadaki FeaturedSlider içerikleri"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Yeni Slide
          </button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error ?? 'Slider verileri yüklenemedi.'} onRetry={() => refetch()} />}
      {!isLoading && !isError && sortedRows.length === 0 && (
        <EmptyState title="Henüz slide yok" description="Ana sayfada göstermek için bir slide ekleyin." />
      )}
      {!isLoading && !isError && sortedRows.length > 0 && (
        <DataTable columns={columns} rows={sortedRows} rowKey={(row) => row.id} />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? 'Slide Düzenle' : 'Yeni Slide'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={isMutating}
      >
        <div className="field">
          <label htmlFor="slide-title">Title</label>
          <input
            id="slide-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="slide-description">Description</label>
          <textarea
            id="slide-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="slide-badge">Badge</label>
            <input
              id="slide-badge"
              value={form.badge ?? ''}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="slide-type">Type</label>
            <select
              id="slide-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as FeaturedSlideType })}
            >
              {SLIDE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="slide-cta">CTA Label</label>
            <input
              id="slide-cta"
              value={form.ctaLabel ?? ''}
              onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="slide-image">Image URL</label>
            <input
              id="slide-image"
              value={form.imageUrl ?? ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="slide-target-type">Target Type</label>
            <select
              id="slide-target-type"
              value={form.targetType ?? ''}
              onChange={(e) =>
                setForm({ ...form, targetType: (e.target.value || undefined) as FeaturedSlideType | undefined })
              }
            >
              <option value="">—</option>
              {SLIDE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="slide-target-id">Target ID</label>
            <input
              id="slide-target-id"
              value={form.targetId ?? ''}
              onChange={(e) => setForm({ ...form, targetId: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="slide-sort">Sort Order</label>
            <input
              id="slide-sort"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
            {errors.sortOrder && <span className="field-error">{errors.sortOrder}</span>}
          </div>
          <div className="field checkbox-field" style={{ alignSelf: 'end', paddingBottom: 8 }}>
            <input
              id="slide-active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <label htmlFor="slide-active">Active</label>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="slide-starts">Starts At</label>
            <input
              id="slide-starts"
              type="date"
              value={form.startsAt ?? ''}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="slide-ends">Ends At</label>
            <input
              id="slide-ends"
              type="date"
              value={form.endsAt ?? ''}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Slide'ı sil"
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
