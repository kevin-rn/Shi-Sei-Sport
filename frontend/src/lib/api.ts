import axios from 'axios';
// Belangrijk: Gebruik Instructor (enkelvoud) en 'import type'
import type { Instructor, Media, Schedule, Location } from '../types/payload-types';

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
  const response = await api.get<PaginatedResponse<Schedule>>(`/schedule?limit=100&depth=2&locale=${locale}`);
  return response.data;
};
   
export const getLocations = async (): Promise<PaginatedResponse<Location>> => {
  const response = await api.get<PaginatedResponse<Location>>('/locations');
  return response.data;
};