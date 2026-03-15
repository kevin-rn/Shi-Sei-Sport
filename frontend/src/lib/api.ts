import axios from 'axios';
import type { Instructor, Media, Schedule, News, Location, Document } from '../types/payload-types';
import type {
  AgendaItem,
  Grade,
  KyuGrade,
  Price,
  PricingSettings,
  ContactInfo,
  VCPInfo,
  DanGradesInfo,
  PaginatedResponse,
  VideoEmbed,
  Album,
  MediaLike,
} from '../types/api-types';

// Re-export all types for backwards compatibility
export type {
  AgendaItem,
  Grade,
  KyuGrade,
  Price,
  PricingSettings,
  ContactInfo,
  VCPInfo,
  DanGradesInfo,
  PaginatedResponse,
  VideoEmbed,
  Album,
  MediaLike,
};

export const api = axios.create({
  baseURL: '/api',
});

/** Converts a video watch/share URL to an embeddable iframe URL. Supports YouTube and Vimeo. */
export const getVideoEmbedUrl = (url: string): string => {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
};

/**
 * Resolves a media object or URL string to a public URL, rewriting
 * internal MinIO addresses to the Caddy `/media/` proxy path.
 *
 * @param media - A Payload media object or a raw URL string.
 * @param size  - Optional size variant: `'placeholder'` (~20px blur preview)
 *                or `'thumbnail'` (max 720×720).
 */
export const getImageUrl = (media: string | MediaLike | null | undefined, size?: 'placeholder' | 'thumbnail') => {
  if (!media) return '';
  let url: string | null | undefined;
  if (typeof media === 'string') {
    url = media;
  } else if (size && (media as MediaLike).sizes?.[size]?.url) {
    url = (media as MediaLike).sizes![size].url;
  } else {
    url = (media as MediaLike).url;
  }
  const internalS3Host = process.env.NEXT_PUBLIC_INTERNAL_S3_HOST || 'minio:9000'
  if (url && url.includes(internalS3Host)) {
    return url.replace(new RegExp(`https?://${internalS3Host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[^/]+/`), '/media/');
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

export const getMediaByFilename = async (filename: string): Promise<Media | null> => {
  const response = await api.get<PaginatedResponse<Media>>(`/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1`);
  return response.data.docs[0] ?? null;
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
  let url = '/agenda?sort=startDate&depth=2&limit=50&where[status][in][0]=published';

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

export const getAlbums = async (
  locale?: string,
  limit: number = 50,
  page: number = 1,
  search?: string,
  year?: string,
  contentType?: 'photos' | 'videos' | ''
): Promise<PaginatedResponse<Album>> => {
  const params: Record<string, string | number | boolean | undefined> = {
    limit,
    page,
    sort: '-date',
    depth: 2,
    'where[status][equals]': 'published',
    'where[isHeroCarousel][not_equals]': true,
    'where[isBanner][not_equals]': true,
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
  } else if (contentType === 'photos') {
    params['where[photos][exists]'] = 'true';
    params['where[videos][exists]'] = 'false';
  }

  const response = await api.get<PaginatedResponse<Album>>('/albums', { params });
  const data = response.data;
  data.docs = data.docs.filter((a) => !a.isHeroCarousel && !a.isBanner);
  return data;
};

export const getHeroCarousel = async (locale?: string): Promise<Album | null> => {
  const params: Record<string, string | number | boolean | undefined> = {
    depth: 2,
    limit: 1,
    'where[isHeroCarousel][equals]': true,
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
  const params: Record<string, string | number | boolean | undefined> = {
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
