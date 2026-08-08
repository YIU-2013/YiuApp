import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useSingletonResource } from '../hooks/useSingletonResource';
import { contactService } from '../services/contactService';
import type { ContactInfo } from '../types/models';

export default function ContactInfoPage() {
  const { data, isLoading, isError, error, update, isMutating } = useSingletonResource<ContactInfo>(
    'contact-info',
    contactService,
  );

  const [form, setForm] = useState<ContactInfo | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  if (isLoading || !form) return <LoadingState />;
  if (isError) return <ErrorState message={error ?? 'İletişim bilgileri yüklenemedi.'} />;

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.generalPhone.trim()) next.generalPhone = 'Telefon zorunludur.';
    if (!form.generalEmail.trim()) next.generalEmail = 'E-posta zorunludur.';
    if (!form.address.trim()) next.address = 'Adres zorunludur.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await update(form);
    setSavedAt(Date.now());
  };

  return (
    <div>
      <PageHeader title="İletişim Bilgileri" description="Mobil uygulamadaki İletişim ekranının içerikleri" />

      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="ci-phone">Genel Telefon</label>
            <input
              id="ci-phone"
              value={form.generalPhone}
              onChange={(e) => setForm({ ...form, generalPhone: e.target.value })}
            />
            {errors.generalPhone && <span className="field-error">{errors.generalPhone}</span>}
          </div>

          <div className="field">
            <label htmlFor="ci-email">Genel E-posta</label>
            <input
              id="ci-email"
              type="email"
              value={form.generalEmail}
              onChange={(e) => setForm({ ...form, generalEmail: e.target.value })}
            />
            {errors.generalEmail && <span className="field-error">{errors.generalEmail}</span>}
          </div>

          <div className="field">
            <label htmlFor="ci-address">Adres</label>
            <textarea
              id="ci-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="field">
            <label htmlFor="ci-map">Harita URL</label>
            <input
              id="ci-map"
              value={form.mapUrl ?? ''}
              onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="ci-sa-phone">Öğrenci İşleri Telefonu</label>
              <input
                id="ci-sa-phone"
                value={form.studentAffairsPhone}
                onChange={(e) => setForm({ ...form, studentAffairsPhone: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="ci-sa-email">Öğrenci İşleri E-postası</label>
              <input
                id="ci-sa-email"
                type="email"
                value={form.studentAffairsEmail}
                onChange={(e) => setForm({ ...form, studentAffairsEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="ci-support">Destek Metni</label>
            <textarea
              id="ci-support"
              value={form.supportText}
              onChange={(e) => setForm({ ...form, supportText: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <button type="button" className="btn btn--primary" onClick={handleSave} disabled={isMutating}>
              {isMutating ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
            {savedAt && <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Kaydedildi ✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
