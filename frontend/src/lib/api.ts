import axios from 'axios';
// Belangrijk: Gebruik Instructor (enkelvoud) en 'import type'
import type { Instructor, Media, Schedule, Location, Document } from '../types/payload-types';

// AgendaItem interface (temporary until types are regenerated)
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

// KyuGrade interface (temporary until types are regenerated)
export interface KyuGrade {
  id: number;
  beltLevel: 'yellow-5kyu' | 'orange-4kyu' | 'green-3kyu' | 'blue-2kyu' | 'brown-1kyu';
  kyuRank: number;
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
  examDocument?: (number | null) | Media;
  supplementaryDocuments?: {
    document?: (number | null) | Media;
    description?: string | null;
    id?: string | null;
  }[] | null;
  minimumAge?: string | null;
  order: number;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  createdAt: string;
}

// Setup Axios Client
export const api = axios.create({
  baseURL: '/api', 
});

// Payload CMS Paginated Response Type
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPage: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Image URL Fixer
export const getImageUrl = (media: any) => {
  if (!media) return '';
  
  // Handelt zowel ID strings als objecten af
  let url = typeof media === 'string' ? media : media.url;
  
  // Minio naar Localhost voor lokale ontwikkeling in Docker
  if (url && url.includes('minio:9000')) {
    return url.replace('minio:9000', 'localhost:9000');
  }
  
  return url;
};

// API Methods voor Collections
export const getInstructors = async (): Promise<PaginatedResponse<Instructor>> => {
  const response = await api.get<PaginatedResponse<Instructor>>('/instructors?sort=order');
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

export const getLocations = async (): Promise<PaginatedResponse<Location>> => {
  const response = await api.get<PaginatedResponse<Location>>('/locations');
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

export const getKyuGrades = async (locale?: string): Promise<PaginatedResponse<KyuGrade>> => {
  let url = '/kyu-grades?sort=order&depth=2&where[status][equals]=published';
  if (locale) {
    url += `&locale=${locale}`;
  }
  const response = await api.get<PaginatedResponse<KyuGrade>>(url);
  return response.data;
};

export const getAgendaItems = async (locale?: string, year?: number): Promise<PaginatedResponse<AgendaItem>> => {
  let url = '/agenda?sort=startDate&depth=2&where[status][in][0]=published';

  // Filter by year if provided
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