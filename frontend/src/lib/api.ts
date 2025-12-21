import axios from 'axios';

// Setup Axios Client
export const api = axios.create({
  baseURL: '/api', 
});

// Image URL Fixer
export const getImageUrl = (media: any) => {
  if (!media) return '';
  
  // Handle case where media is just an ID string vs an object
  let url = typeof media === 'string' ? media : media.url;
  
  if (url && url.includes('minio:9000')) {
    return url.replace('minio:9000', 'localhost:9000');
  }
  
  return url;
};