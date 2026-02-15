import axios from 'axios';
import type { Instructor, Media, Schedule, News, Location, Document } from '../types/payload-types';

export interface AgendaItem {
  id: number;
  slug: string;
  title: string;
  description?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  category: 'vacation' | 'holiday' | 'exam' | 'competition' | 'other';
  startDate: string;
  endDate?: string | null;
  allDay: boolean;
  startTime?: string | null;
  endTime?: string | null;
  location?: (number | Location) | null;
  customLocation?: string | null;
  coverImage?: (number | Media) | null;
  status: 'draft' | 'published' | 'cancelled';
  registrationRequired: boolean;
  registrationDeadline?: string | null;
  maxParticipants?: number | null;
  externalUrl?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface Grade {
  id: number;
  gradeType: 'kyu' | 'dan';
  // Kyu-specific fields
  beltLevel?: 'yellow-5kyu' | 'orange-4kyu' | 'green-3kyu' | 'blue-2kyu' | 'brown-1kyu';
  kyuRank?: number;
  examDocument?: (number | null) | Media;
  supplementaryDocuments?: {
    document?: (number | null) | Media;
    description?: string | null;
    id?: string | null;
  }[] | null;
  minimumAge?: string | null;
  // Dan-specific fields
  externalUrl?: string | null;
  externalUrlText?: string | null;
  // Common fields
  title: string;
  description: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  order: number;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  createdAt: string;
}

export type KyuGrade = Grade;

// Price interface (unified plan and settings)
export interface Price {
  id: number;
  priceType: 'plan' | 'settings';
  // Plan-specific fields
  planName?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  features?: {
    feature: string;
    id?: string | null;
  }[];
  popular?: boolean;
  // Settings-specific fields
  registrationFee?: string;
  ooievaarspasText?: string | null;
  // Common fields
  displayOrder: number;
  updatedAt: string;
  createdAt: string;
}

export type PricingSettings = Price;

export interface ContactInfo {
  id: number;
  postalAddress: string;
  phones: {
    number: string;
    id?: string | null;
  }[];
  emails: {
    email: string;
    id?: string | null;
  }[];
  globalType: string;
  updatedAt: string;
  createdAt: string;
}

export interface VCPInfo {
  id: number;
  vcpName: string;
  vcpEmail: string;
  vcpSince?: string | null;
  introduction: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  whatDoesVcpDo: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  forWhom: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  whyContact: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  vcpBio?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  preventivePolicy?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  crossingBehavior?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  vcpTasks?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  globalType: string;
  updatedAt: string;
  createdAt: string;
}

export type DanGradesInfo = Grade;

export const api = axios.create({
  baseURL: '/api',
});

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/** Converts a YouTube watch/share URL to an embeddable iframe URL. */
export const getYouTubeEmbedUrl = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
};

/** Resolves a media object or URL string to a public URL, rewriting internal MinIO addresses to the Caddy proxy path.
 *  Pass size='placeholder' (~20px, blur preview) or 'thumbnail' (max 720×720) to use a generated variant. */
export const getImageUrl = (media: any, size?: 'placeholder' | 'thumbnail') => {
  if (!media) return '';
  let url: string | null | undefined;
  if (typeof media === 'string') {
    url = media;
  } else if (size && media.sizes?.[size]?.url) {
    url = media.sizes[size].url;
  } else {
    url = media.url;
  }
  if (url && url.includes('minio:9000')) {
    return url.replace(/https?:\/\/minio:9000\/[^/]+\//, '/media/');
  }
  return url ?? '';
};

export const getInstructors = async (locale?: string): Promise<PaginatedResponse<Instructor>> => {
  let url = '/instructors?sort=order';
  if (locale) url += `&locale=${locale}`;
  const response = await api.get<PaginatedResponse<Instructor>>(url);
  return response.data;
};

export const getInstructor = async (id: string): Promise<Instructor> => {
  const response = await api.get<Instructor>(`/instructors/${id}`);
  return response.data;
};

export const getMedia = async (): Promise<PaginatedResponse<Media>> => {
  const response = await api.get<PaginatedResponse<Media>>('/media');
  return response.data;
};

export const getSchedule = async (locale: string): Promise<PaginatedResponse<Schedule>> => {
  const response = await api.get<PaginatedResponse<Schedule>>(`/training-schedule?limit=100&depth=2&locale=${locale}`);
  return response.data;
};

export const getLocations = async (locale?: string): Promise<PaginatedResponse<Location>> => {
  let url = '/locations';
  if (locale) url += `?locale=${locale}`;
  const response = await api.get<PaginatedResponse<Location>>(url);
  return response.data;
};

export const getDocuments = async (category?: 'regulation' | 'enrollment', locale?: string): Promise<PaginatedResponse<Document>> => {
  let url = '/documents?sort=order&depth=2';
  if (category) {
    url += `&where[category][equals]=${category}`;
  }
  if (locale) {
    url += `&locale=${locale}`;
  }
  const response = await api.get<PaginatedResponse<Document>>(url);
  return response.data;
};

export const getGrades = async (locale?: string, gradeType?: 'kyu' | 'dan'): Promise<PaginatedResponse<Grade>> => {
  let url = '/grades?sort=order&depth=2&where[status][equals]=published';
  if (gradeType) {
    url += `&where[gradeType][equals]=${gradeType}`;
  }
  if (locale) {
    url += `&locale=${locale}`;
  }
  const response = await api.get<PaginatedResponse<Grade>>(url);
  return response.data;
};

export const getKyuGrades = async (locale?: string): Promise<PaginatedResponse<KyuGrade>> => {
  return getGrades(locale, 'kyu');
};

export const getAgendaItems = async (locale?: string, year?: number): Promise<PaginatedResponse<AgendaItem>> => {
  let url = '/agenda?sort=startDate&depth=2&where[status][in][0]=published';

  if (year) {
    const startOfYear = `${year}-01-01`;
    const endOfYear = `${year}-12-31`;
    url += `&where[startDate][greater_than_equal]=${startOfYear}&where[startDate][less_than_equal]=${endOfYear}`;
  }

  if (locale) {
    url += `&locale=${locale}`;
  }

  const response = await api.get<PaginatedResponse<AgendaItem>>(url);
  return response.data;
};

export const getPrices = async (locale?: string, priceType?: 'plan' | 'settings'): Promise<PaginatedResponse<Price>> => {
  let url = '/prices?sort=displayOrder';
  if (priceType) {
    url += `&where[priceType][equals]=${priceType}`;
  }
  if (locale) {
    url += `&locale=${locale}`;
  }
  const response = await api.get<PaginatedResponse<Price>>(url);
  return response.data;
};

export const getPricingSettings = async (locale?: string): Promise<PricingSettings | null> => {
  try {
    const response = await getPrices(locale, 'settings');
    return response.docs[0] || null;
  } catch (error) {
    console.error('Error fetching pricing settings:', error);
    return null;
  }
};

export const getContactInfo = async (locale?: string): Promise<ContactInfo> => {
  let url = '/globals/contact-info';
  if (locale) url += `?locale=${locale}`;
  const response = await api.get<ContactInfo>(url);
  return response.data;
};

export const getVCPInfo = async (locale?: string): Promise<VCPInfo> => {
  let url = '/globals/vcp-info';
  if (locale) {
    url += `?locale=${locale}`;
  }
  const response = await api.get<VCPInfo>(url);
  return response.data;
};

export const getDanGradesInfo = async (locale?: string): Promise<DanGradesInfo | null> => {
  try {
    const response = await getGrades(locale, 'dan');
    return response.docs[0] || null;
  } catch (error) {
    console.error('Error fetching Dan grade info:', error);
    return null;
  }
};

export interface VideoEmbed {
  id: number;
  title: string;
  embedUrl: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: number;
  title: string;
  description?: string;
  photos: (number | Media)[];
  videos?: (number | VideoEmbed)[];
  date: string;
  status: 'draft' | 'published';
  isHeroCarousel?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAlbums = async (
  locale?: string,
  limit: number = 50,
  page: number = 1,
  search?: string,
  year?: string,
  contentType?: 'photos' | 'videos' | ''
): Promise<PaginatedResponse<Album>> => {
  const params: Record<string, any> = {
    limit,
    page,
    sort: '-date',
    depth: 2,
    'where[status][equals]': 'published',
    'where[isHeroCarousel][not_equals]': 'true',
    locale
  };

  if (search) {
    params['where[title][like]'] = search;
  }

  if (year) {
    params['where[date][greater_than_equal]'] = `${year}-01-01`;
    params['where[date][less_than_equal]'] = `${year}-12-31`;
  }

  if (contentType === 'videos') {
    params['where[videos][exists]'] = 'true';
  }

  const response = await api.get<PaginatedResponse<Album>>('/albums', { params });
  return response.data;
};

export const getHeroCarousel = async (locale?: string): Promise<Album | null> => {
  const params: Record<string, any> = {
    depth: 2,
    limit: 1,
    'where[isHeroCarousel][equals]': 'true',
    'where[status][equals]': 'published',
    locale,
  };
  const response = await api.get<PaginatedResponse<Album>>('/albums', { params });
  return response.data.docs[0] ?? null;
};

export const getAlbum = async (id: string, locale?: string): Promise<Album> => {
  let url = `/albums/${id}?depth=2`;
  if (locale) {
    url += `&locale=${locale}`;
  }
  const response = await api.get<Album>(url);
  return response.data;
};

export const getNews = async (
  page: number = 1,
  limit: number = 12,
  search?: string,
  year?: string,
  locale?: string,
  month?: string
): Promise<PaginatedResponse<News>> => {
  const params: Record<string, any> = {
    limit,
    page,
    sort: '-publishedDate',
  };

  if (locale) {
    params['locale'] = locale;
  }

  if (search) {
    params['where[title][like]'] = search;
  }

  if (year && month) {
    const paddedMonth = month.padStart(2, '0');
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
    params['where[publishedDate][greater_than_equal]'] = `${year}-${paddedMonth}-01`;
    params['where[publishedDate][less_than_equal]'] = `${year}-${paddedMonth}-${daysInMonth}`;
  } else if (year) {
    params['where[publishedDate][greater_than_equal]'] = `${year}-01-01`;
    params['where[publishedDate][less_than_equal]'] = `${year}-12-31`;
  }

  const response = await api.get<PaginatedResponse<News>>('/news', { params });
  return response.data;
};