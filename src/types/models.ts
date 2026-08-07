// ─── Duyuru ───────────────────────────────────────────────────────────────────
export type AnnouncementType = 'AKADEMİK' | 'ÖNEMLİ' | 'DUYURU';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl?: string;
  tags?: string[];
}

// ─── Etkinlik ────────────────────────────────────────────────────────────────
export interface Event {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  time: string;
  endTime?: string;
  location: string;
  description: string;
  category?: string;
}

// ─── API Yanıt Sarmalayıcı ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ─── Hata ────────────────────────────────────────────────────────────────────
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ─── Bölüm / Program ──────────────────────────────────────────────────────────
export interface Department {
  id: string;
  name: string;
  duration: number; // e.g. 4 or 2 years
  language: string; // e.g. 'Türkçe' or 'İngilizce'
  description: string;
  careerOpportunities?: string[];
}

// ─── Fırsat / Ayrıcalık ─────────────────────────────────────────────────────────
export type OpportunityCategory =
  | 'İndirim'
  | 'Kampüs Fırsatı'
  | 'Anlaşmalı Kurum'
  | 'Sosyal İmkan';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  icon: string; // Ionicons name
  actionLabel?: string;
  actionUrl?: string;
}

// ─── Fakülte / Yüksekokul ──────────────────────────────────────────────────────
export interface Faculty {
  id: string;
  name: string;
  code: string; // e.g. 'TIP', 'SBF', 'SHMYO'
  icon: string; // Ionicons name
  description: string;
  dean: string; // Dekan/Müdür ismi
  contactEmail: string;
  contactPhone: string;
  departments: Department[];
}
