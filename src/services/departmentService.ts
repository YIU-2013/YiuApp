import { Faculty } from '../types/models';
import { Cache } from '../utils/cache';

const CACHE_KEY = 'faculties';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const MOCK_FACULTIES: Faculty[] = [
  {
    id: 'fac-1',
    name: 'Tıp Fakültesi',
    code: 'TIP',
    icon: 'medkit-outline',
    description: 'Uluslararası standartlarda tıp eğitimi veren, araştırma odaklı ve modern laboratuvar altyapısına sahip öncü fakültemiz.',
    dean: 'Prof. Dr. M. Zülküf Önal',
    contactEmail: 'tip@yiu.edu.tr',
    contactPhone: '0 (312) 329 10 11',
    departments: [
      {
        id: 'dept-1-1',
        name: 'Tıp Pr. (Türkçe)',
        duration: 6,
        language: 'Türkçe',
        description: '6 yıllık temel ve klinik tıp eğitimi programı. Öğrencilerimiz ileri simülasyon merkezleri ve anlaşmalı hastanelerde pratik yapma imkanına sahiptir.',
        careerOpportunities: [
          'Uzman veya Pratisyen Hekimlik',
          'Akademik Kariyer ve Tıbbi Araştırmalar',
          'Sağlık Bakanlığı ve Kamu Hastaneleri Yönetimi',
          'Özel Hastaneler ve Klinik Zincirleri'
        ]
      },
      {
        id: 'dept-1-2',
        name: 'Tıp Pr. (İngilizce)',
        duration: 6,
        language: 'İngilizce',
        description: 'Tümüyle İngilizce yürütülen, küresel tıp literatürüyle tam entegre, uluslararası kariyer hedefleyen hekim adayları için tasarlanmış 6 yıllık eğitim programı.',
        careerOpportunities: [
          'Uluslararası Sağlık Kuruluşları (WHO, UNICEF vb.)',
          'Yurtdışı Klinik ve Araştırma Merkezleri',
          'Akademik Kariyer (Yurtiçi/Yurtdışı)',
          'Çok Uluslu İlaç ve Biyoteknoloji Firmaları'
        ]
      }
    ]
  },
  {
    id: 'fac-2',
    name: 'Diş Hekimliği Fakültesi',
    code: 'DIS',
    icon: 'ribbon-outline',
    description: 'Modern klinik simülasyon üniteleri ve uzman akademik kadrosuyla ağız ve diş sağlığı alanında yetkin hekimler yetiştiren fakültemiz.',
    dean: 'Prof. Dr. H. Hüseyin Köşger',
    contactEmail: 'dis@yiu.edu.tr',
    contactPhone: '0 (312) 329 10 12',
    departments: [
      {
        id: 'dept-2-1',
        name: 'Diş Hekimliği Pr.',
        duration: 5,
        language: 'Türkçe',
        description: '5 yıllık lisans programı kapsamında temel fen bilimleri, preklinik simülasyon eğitimi ve son iki yılda yoğun klinik staj imkanı sunulmaktadır.',
        careerOpportunities: [
          'Özel Diş Klinikleri ve Ağız Diş Sağlığı Merkezleri',
          'Kamu Hastaneleri (Diş Hekimliği kadroları)',
          'Diş Hekimliğinde Uzmanlık Sınavı (DUS) ile Uzman Hekimlik',
          'Medikal Cihaz ve Dental Malzeme Sektörü'
        ]
      }
    ]
  },
  {
    id: 'fac-3',
    name: 'Sağlık Bilimleri Fakültesi',
    code: 'SBF',
    icon: 'heart-half-outline',
    description: 'Sağlık sektörünün ihtiyaç duyduğu uzman fizyoterapist, hemşire, diyetisyen ve dil konuşma terapistlerini yetiştiren çok disiplinli fakültemiz.',
    dean: 'Prof. Dr. Fatma Öz',
    contactEmail: 'sbf@yiu.edu.tr',
    contactPhone: '0 (312) 329 10 13',
    departments: [
      {
        id: 'dept-3-1',
        name: 'Hemşirelik',
        duration: 4,
        language: 'Türkçe',
        description: 'Koruyucu, rehabilite edici ve tedavi edici sağlık hizmetlerinde aktif rol oynayan, etik değerlere bağlı profesyonel hemşireler yetiştiren 4 yıllık lisans programı.',
        careerOpportunities: [
          'Kamu ve Özel Sağlık Kuruluşları (Yoğun Bakım, Poliklinikler vb.)',
          'Okul ve İşyeri Sağlığı Hemşireliği',
          'Sağlık Turizmi Firmaları',
          'Hemşirelik Alanında Akademisyenlik'
        ]
      },
      {
        id: 'dept-3-2',
        name: 'Beslenme ve Diyetetik',
        duration: 4,
        language: 'Türkçe',
        description: 'Sağlıklı yaşam, toplumsal beslenme bilinci ve hastalık durumlarında tıbbi beslenme tedavileri planlayabilen uzman diyetisyenler yetiştiren lisans programı.',
        careerOpportunities: [
          'Hastaneler ve Zayıflama Merkezleri',
          'Toplu Beslenme/Yemek Üretim (Catering) Firmaları',
          'Spor Kulüpleri ve Fitness Merkezleri',
          'Gıda ve Nutrasötik Endüstrisi'
        ]
      },
      {
        id: 'dept-3-3',
        name: 'Fizyoterapi ve Rehabilitasyon',
        duration: 4,
        language: 'Türkçe',
        description: 'Hareket ve fonksiyon bozukluklarında kanıta dayalı fizyoterapi yaklaşımlarını uygulayabilen, mesleki ahlakı yüksek fizyoterapistler yetiştirmeyi amaçlayan program.',
        careerOpportunities: [
          'Fizik Tedavi ve Rehabilitasyon Merkezleri',
          'Ortopedi, Nöroloji ve Pediatri Klinikleri',
          'Sporcu Sağlığı ve Rehabilitasyon Merkezleri',
          'Huzurevleri ve Evde Bakım Servisleri'
        ]
      },
      {
        id: 'dept-3-4',
        name: 'Dil ve Konuşma Terapisi',
        duration: 4,
        language: 'Türkçe',
        description: 'İletişim, dil, konuşma, ses ve yutma bozukluklarının önlenmesi, değerlendirilmesi ve rehabilitasyonu konularında uzmanlaşan Dil ve Konuşma Terapistleri yetiştirir.',
        careerOpportunities: [
          'Özel Eğitim ve Rehabilitasyon Merkezleri',
          'Devlet ve Üniversite Hastaneleri (Klinikler)',
          'Özel Danışmanlık ve Terapi Merkezleri',
          'Akademik Araştırma ve Geliştirme'
        ]
      }
    ]
  },
  {
    id: 'fac-4',
    name: 'Sağlık Hizmetleri Meslek Yüksekokulu',
    code: 'SHMYO',
    icon: 'people-outline',
    description: 'Sağlık kurumlarının ara eleman ihtiyacını karşılamak üzere 2 yıllık pratik ağırlıklı ön lisans eğitimi sunan yüksekokulumuz.',
    dean: 'Prof. Dr. Rona Aslan',
    contactEmail: 'shmyo@yiu.edu.tr',
    contactPhone: '0 (312) 329 10 14',
    departments: [
      {
        id: 'dept-4-1',
        name: 'İlk ve Acil Yardım (Paramedik)',
        duration: 2,
        language: 'Türkçe',
        description: 'Hastane öncesi acil bakımda kritik kararlar alabilen, ambulans ve acil servislerde görev alacak donanımlı paramedikler yetiştirir.',
        careerOpportunities: [
          '112 Acil Sağlık Hizmetleri İstasyonları',
          'Özel ve Kamu Hastanesi Acil Servisleri',
          'Ambulans Servisleri (Özel)',
          'Arama Kurtarma Ekipleri ve AFAD'
        ]
      },
      {
        id: 'dept-4-2',
        name: 'Anestezi',
        duration: 2,
        language: 'Türkçe',
        description: 'Ameliyathane süreçlerinde anestezi uzmanı hekime yardımcı olacak, anestezi ekipmanlarını yönetebilecek anestezi teknikerleri yetiştirir.',
        careerOpportunities: [
          'Tüm Ameliyathaneler (Kamu, Özel, Üniversite)',
          'Ağrı Poliklinikleri',
          'Reanimasyon ve Yoğun Bakım Üniteleri'
        ]
      },
      {
        id: 'dept-4-3',
        name: 'Tıbbi Görüntüleme Teknikleri',
        duration: 2,
        language: 'Türkçe',
        description: 'Röntgen, Bilgisayarlı Tomografi (BT), Manyetik Rezonans (MR) gibi radyolojik cihazları güvenli şekilde kullanabilen teknikerler yetiştirir.',
        careerOpportunities: [
          'Radyoloji Departmanları',
          'Nükleer Tıp ve Radyoterapi Merkezleri',
          'Görüntüleme Merkezleri (Özel)'
        ]
      }
    ]
  }
];

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const departmentService = {
  getAll: async (signal?: AbortSignal): Promise<Faculty[]> => {
    try {
      await delay(600); // simulate network latency
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

      await Cache.set(CACHE_KEY, MOCK_FACULTIES, CACHE_TTL);
      return MOCK_FACULTIES;
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      const cached = await Cache.get<Faculty[]>(CACHE_KEY);
      if (cached) return cached;
      throw err;
    }
  },

  getById: async (id: string): Promise<Faculty | null> => {
    const all = await departmentService.getAll();
    return all.find((f) => f.id === id) ?? null;
  },
} as const;
