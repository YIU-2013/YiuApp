// ─── Auth ───────────────────────────────────────────────────────────────────
export type AdminRole = 'SuperAdmin' | 'Admin' | 'Editor' | 'Viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

// ─── Featured Slide (Ana sayfa slider) ─────────────────────────────────────
export type FeaturedSlideType = 'announcement' | 'opportunity' | 'event' | 'campus';

export interface FeaturedSlide {
  id: string;
  title: string;
  description: string;
  badge?: string;
  type: FeaturedSlideType;
  ctaLabel?: string;
  imageUrl?: string;
  /** Slide'ın deep-link hedefi — hangi kaynağa (announcement/event/...) gideceği */
  targetType?: FeaturedSlideType;
  targetId?: string;
  sortOrder: number;
  active: boolean;
  startsAt?: string; // ISO date
  endsAt?: string; // ISO date
}

// ─── Announcement (Duyuru) ──────────────────────────────────────────────────
export type AnnouncementCategory = 'AKADEMİK' | 'ÖNEMLİ' | 'DUYURU';

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: AnnouncementCategory;
  imageUrl?: string;
  publishedAt: string; // ISO date
  pinned: boolean;
  active: boolean;
}

// ─── Event (Etkinlik) ────────────────────────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string; // ISO date
  imageUrl?: string;
  category?: string;
  active: boolean;
}

// ─── Opportunity (Fırsat) ────────────────────────────────────────────────────
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
  badge?: string;
  imageUrl?: string;
  actionLabel?: string;
  actionUrl?: string;
  active: boolean;
  sortOrder: number;
}

// ─── Campus Content (Kampüsüm içerikleri) ──────────────────────────────────
export interface CampusContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string; // Kütüphane, Yemekhane, Kulüpler, Ulaşım, Sosyal Alanlar...
  sortOrder: number;
  active: boolean;
}

// ─── Faculty / Department ───────────────────────────────────────────────────
export interface Faculty {
  id: string;
  name: string;
  description: string;
  icon: string;
  dean: string;
  contactEmail: string;
  active: boolean;
  sortOrder: number;
}

export interface Department {
  id: string;
  facultyId: string;
  name: string;
  degreeType: string; // Lisans / Ön Lisans / Yüksek Lisans
  duration: number; // yıl
  language: string;
  description: string;
  active: boolean;
  sortOrder: number;
}

// ─── Contact Info (tekil ayar) ───────────────────────────────────────────────
export interface ContactInfo {
  generalPhone: string;
  generalEmail: string;
  address: string;
  mapUrl?: string;
  studentAffairsPhone: string;
  studentAffairsEmail: string;
  supportText: string;
}
