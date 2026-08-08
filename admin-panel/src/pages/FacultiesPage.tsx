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
import { facultyService, departmentService } from '../services/departmentService';
import type { Faculty, Department } from '../types/models';

type Tab = 'faculties' | 'departments';

type FacultyForm = Omit<Faculty, 'id'>;
const EMPTY_FACULTY: FacultyForm = {
  name: '',
  description: '',
  icon: '',
  dean: '',
  contactEmail: '',
  active: true,
  sortOrder: 1,
};

type DepartmentForm = Omit<Department, 'id'>;
const emptyDepartment = (facultyId: string): DepartmentForm => ({
  facultyId,
  name: '',
  degreeType: 'Lisans',
  duration: 4,
  language: 'Türkçe',
  description: '',
  active: true,
  sortOrder: 1,
});

export default function FacultiesPage() {
  const [tab, setTab] = useState<Tab>('faculties');

  const faculties = useCrudResource<Faculty>('faculties', facultyService);
  const departments = useCrudResource<Department>('departments', departmentService);

  const facultyNameById = useMemo(
    () => new Map(faculties.data.map((f) => [f.id, f.name])),
    [faculties.data],
  );

  // ── Faculty modal state
  const [facModalOpen, setFacModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [facForm, setFacForm] = useState<FacultyForm>(EMPTY_FACULTY);
  const [facErrors, setFacErrors] = useState<Record<string, string>>({});
  const [deleteFaculty, setDeleteFaculty] = useState<Faculty | null>(null);

  const openCreateFaculty = () => {
    setEditingFaculty(null);
    setFacForm(EMPTY_FACULTY);
    setFacErrors({});
    setFacModalOpen(true);
  };
  const openEditFaculty = (item: Faculty) => {
    setEditingFaculty(item);
    setFacForm({ ...item });
    setFacErrors({});
    setFacModalOpen(true);
  };
  const validateFaculty = (): boolean => {
    const next: Record<string, string> = {};
    if (!facForm.name.trim()) next.name = 'Ad zorunludur.';
    if (!facForm.dean.trim()) next.dean = 'Dekan/Müdür adı zorunludur.';
    setFacErrors(next);
    return Object.keys(next).length === 0;
  };
  const submitFaculty = async () => {
    if (!validateFaculty()) return;
    if (editingFaculty) {
      await faculties.update(editingFaculty.id, facForm);
    } else {
      await faculties.create(facForm);
    }
    setFacModalOpen(false);
  };

  // ── Department modal state
  const [depModalOpen, setDepModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [depForm, setDepForm] = useState<DepartmentForm>(emptyDepartment(''));
  const [depErrors, setDepErrors] = useState<Record<string, string>>({});
  const [deleteDepartment, setDeleteDepartment] = useState<Department | null>(null);

  const openCreateDepartment = () => {
    setEditingDepartment(null);
    setDepForm(emptyDepartment(faculties.data[0]?.id ?? ''));
    setDepErrors({});
    setDepModalOpen(true);
  };
  const openEditDepartment = (item: Department) => {
    setEditingDepartment(item);
    setDepForm({ ...item });
    setDepErrors({});
    setDepModalOpen(true);
  };
  const validateDepartment = (): boolean => {
    const next: Record<string, string> = {};
    if (!depForm.name.trim()) next.name = 'Ad zorunludur.';
    if (!depForm.facultyId) next.facultyId = 'Bağlı fakülte seçmelisiniz.';
    if (!Number.isFinite(depForm.duration) || depForm.duration <= 0) next.duration = 'Süre geçerli olmalıdır.';
    setDepErrors(next);
    return Object.keys(next).length === 0;
  };
  const submitDepartment = async () => {
    if (!validateDepartment()) return;
    if (editingDepartment) {
      await departments.update(editingDepartment.id, depForm);
    } else {
      await departments.create(depForm);
    }
    setDepModalOpen(false);
  };

  const facultyColumns: DataTableColumn<Faculty>[] = [
    {
      key: 'name',
      header: 'Fakülte',
      render: (row) => (
        <div>
          <div className="data-table__title" title={row.name}>{row.name}</div>
          <div className="data-table__muted" title={row.dean}>{row.dean}</div>
        </div>
      ),
    },
    { key: 'contactEmail', header: 'E-posta', render: (row) => row.contactEmail },
    { key: 'sortOrder', header: 'Sıra', render: (row) => row.sortOrder },
    { key: 'active', header: 'Durum', render: (row) => <StatusBadge active={row.active} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="data-table__actions">
          <ActionButton onClick={() => openEditFaculty(row)}>Düzenle</ActionButton>
          <ActionButton onClick={() => faculties.update(row.id, { active: !row.active })}>
            {row.active ? 'Pasife Al' : 'Aktifleştir'}
          </ActionButton>
          <ActionButton variant="danger" onClick={() => setDeleteFaculty(row)}>
            Sil
          </ActionButton>
        </div>
      ),
    },
  ];

  const departmentColumns: DataTableColumn<Department>[] = [
    {
      key: 'name',
      header: 'Bölüm / Program',
      render: (row) => (
        <div>
          <div className="data-table__title" title={row.name}>{row.name}</div>
          <div className="data-table__muted">{facultyNameById.get(row.facultyId) ?? '—'}</div>
        </div>
      ),
    },
    { key: 'degreeType', header: 'Derece', render: (row) => row.degreeType },
    { key: 'duration', header: 'Süre', render: (row) => `${row.duration} yıl` },
    { key: 'language', header: 'Dil', render: (row) => row.language },
    { key: 'active', header: 'Durum', render: (row) => <StatusBadge active={row.active} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="data-table__actions">
          <ActionButton onClick={() => openEditDepartment(row)}>Düzenle</ActionButton>
          <ActionButton onClick={() => departments.update(row.id, { active: !row.active })}>
            {row.active ? 'Pasife Al' : 'Aktifleştir'}
          </ActionButton>
          <ActionButton variant="danger" onClick={() => setDeleteDepartment(row)}>
            Sil
          </ActionButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Fakülte / Bölüm Yönetimi" description="Fakülteler ve onlara bağlı bölüm/programlar" />

      <div className="toolbar">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className={`btn ${tab === 'faculties' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setTab('faculties')}
          >
            Fakülteler
          </button>
          <button
            type="button"
            className={`btn ${tab === 'departments' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setTab('departments')}
          >
            Bölümler / Programlar
          </button>
        </div>
        {tab === 'faculties' ? (
          <button type="button" className="btn btn--primary" onClick={openCreateFaculty}>
            + Yeni Fakülte
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={openCreateDepartment}
            disabled={faculties.data.length === 0}
          >
            + Yeni Bölüm
          </button>
        )}
      </div>

      {tab === 'faculties' && (
        <>
          {faculties.isLoading && <LoadingState />}
          {faculties.isError && (
            <ErrorState message={faculties.error ?? 'Fakülteler yüklenemedi.'} onRetry={() => faculties.refetch()} />
          )}
          {!faculties.isLoading && !faculties.isError && faculties.data.length === 0 && (
            <EmptyState title="Henüz fakülte yok" description="İlk fakülteyi eklemek için yukarıdaki butonu kullanın." />
          )}
          {!faculties.isLoading && !faculties.isError && faculties.data.length > 0 && (
            <DataTable
              columns={facultyColumns}
              rows={[...faculties.data].sort((a, b) => a.sortOrder - b.sortOrder)}
              rowKey={(row) => row.id}
            />
          )}
        </>
      )}

      {tab === 'departments' && (
        <>
          {faculties.data.length === 0 && !faculties.isLoading && (
            <EmptyState title="Önce bir fakülte ekleyin" description="Bölüm eklemek için en az bir fakülte gerekir." />
          )}
          {departments.isLoading && <LoadingState />}
          {departments.isError && (
            <ErrorState message={departments.error ?? 'Bölümler yüklenemedi.'} onRetry={() => departments.refetch()} />
          )}
          {!departments.isLoading && !departments.isError && departments.data.length === 0 && faculties.data.length > 0 && (
            <EmptyState title="Henüz bölüm yok" description="İlk bölümü eklemek için yukarıdaki butonu kullanın." />
          )}
          {!departments.isLoading && !departments.isError && departments.data.length > 0 && (
            <DataTable
              columns={departmentColumns}
              rows={[...departments.data].sort((a, b) => a.sortOrder - b.sortOrder)}
              rowKey={(row) => row.id}
            />
          )}
        </>
      )}

      {/* ── Faculty form modal ─────────────────────────────────────────── */}
      <FormModal
        open={facModalOpen}
        title={editingFaculty ? 'Fakülte Düzenle' : 'Yeni Fakülte'}
        onClose={() => setFacModalOpen(false)}
        onSubmit={submitFaculty}
        submitting={faculties.isMutating}
      >
        <div className="field">
          <label htmlFor="fac-name">Ad</label>
          <input id="fac-name" value={facForm.name} onChange={(e) => setFacForm({ ...facForm, name: e.target.value })} />
          {facErrors.name && <span className="field-error">{facErrors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="fac-description">Açıklama</label>
          <textarea
            id="fac-description"
            value={facForm.description}
            onChange={(e) => setFacForm({ ...facForm, description: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="fac-icon">Icon (Ionicons adı)</label>
            <input
              id="fac-icon"
              placeholder="örn. medical-outline"
              value={facForm.icon}
              onChange={(e) => setFacForm({ ...facForm, icon: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="fac-dean">Dekan</label>
            <input id="fac-dean" value={facForm.dean} onChange={(e) => setFacForm({ ...facForm, dean: e.target.value })} />
            {facErrors.dean && <span className="field-error">{facErrors.dean}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="fac-email">İletişim E-postası</label>
            <input
              id="fac-email"
              type="email"
              value={facForm.contactEmail}
              onChange={(e) => setFacForm({ ...facForm, contactEmail: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="fac-sort">Sıra Numarası</label>
            <input
              id="fac-sort"
              type="number"
              value={facForm.sortOrder}
              onChange={(e) => setFacForm({ ...facForm, sortOrder: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="field checkbox-field">
          <input
            id="fac-active"
            type="checkbox"
            checked={facForm.active}
            onChange={(e) => setFacForm({ ...facForm, active: e.target.checked })}
          />
          <label htmlFor="fac-active">Aktif</label>
        </div>
      </FormModal>

      {/* ── Department form modal ──────────────────────────────────────── */}
      <FormModal
        open={depModalOpen}
        title={editingDepartment ? 'Bölüm Düzenle' : 'Yeni Bölüm'}
        onClose={() => setDepModalOpen(false)}
        onSubmit={submitDepartment}
        submitting={departments.isMutating}
      >
        <div className="field">
          <label htmlFor="dep-faculty">Fakülte</label>
          <select
            id="dep-faculty"
            value={depForm.facultyId}
            onChange={(e) => setDepForm({ ...depForm, facultyId: e.target.value })}
          >
            {faculties.data.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          {depErrors.facultyId && <span className="field-error">{depErrors.facultyId}</span>}
        </div>
        <div className="field">
          <label htmlFor="dep-name">Ad</label>
          <input id="dep-name" value={depForm.name} onChange={(e) => setDepForm({ ...depForm, name: e.target.value })} />
          {depErrors.name && <span className="field-error">{depErrors.name}</span>}
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="dep-degree">Derece Türü</label>
            <select
              id="dep-degree"
              value={depForm.degreeType}
              onChange={(e) => setDepForm({ ...depForm, degreeType: e.target.value })}
            >
              <option value="Ön Lisans">Ön Lisans</option>
              <option value="Lisans">Lisans</option>
              <option value="Yüksek Lisans">Yüksek Lisans</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="dep-duration">Süre (Yıl)</label>
            <input
              id="dep-duration"
              type="number"
              value={depForm.duration}
              onChange={(e) => setDepForm({ ...depForm, duration: Number(e.target.value) })}
            />
            {depErrors.duration && <span className="field-error">{depErrors.duration}</span>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="dep-language">Dil</label>
          <input
            id="dep-language"
            value={depForm.language}
            onChange={(e) => setDepForm({ ...depForm, language: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="dep-description">Açıklama</label>
          <textarea
            id="dep-description"
            value={depForm.description}
            onChange={(e) => setDepForm({ ...depForm, description: e.target.value })}
          />
        </div>
        <div className="field checkbox-field">
          <input
            id="dep-active"
            type="checkbox"
            checked={depForm.active}
            onChange={(e) => setDepForm({ ...depForm, active: e.target.checked })}
          />
          <label htmlFor="dep-active">Aktif</label>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteFaculty}
        title="Fakülteyi sil"
        message={`"${deleteFaculty?.name}" kalıcı olarak silinecek. Bağlı bölümler etkilenebilir. Emin misin?`}
        confirmLabel="Sil"
        danger
        onCancel={() => setDeleteFaculty(null)}
        onConfirm={async () => {
          if (deleteFaculty) await faculties.remove(deleteFaculty.id);
          setDeleteFaculty(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteDepartment}
        title="Bölümü sil"
        message={`"${deleteDepartment?.name}" kalıcı olarak silinecek. Emin misin?`}
        confirmLabel="Sil"
        danger
        onCancel={() => setDeleteDepartment(null)}
        onConfirm={async () => {
          if (deleteDepartment) await departments.remove(deleteDepartment.id);
          setDeleteDepartment(null);
        }}
      />
    </div>
  );
}
