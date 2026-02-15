import type { Payload } from 'payload';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locationsData = [
  {
    name: 'SBO de Springplank',
    address: 'Pachtersdreef 3, 2542 XH Den Haag',
    googleMapsUrl: 'https://maps.google.com/?q=Special+Elementary+Education+De+Springplank',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2454.4879441020216!2d4.261617076349873!3d52.03442547206682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b15e79c8fcb9%3A0x57e933274509e631!2sSpecial%20Elementary%20Education%20De%20Springplank%20(SCOH)!5e0!3m2!1sen!2snl!4v1769978677959!5m2!1sen!2snl',
    coordinates: {
      latitude: 52.0344,
      longitude: 4.2616,
    },
    imageFile: 'springplank.jpg',
    imageAlt: 'SBO de Springplank',
  },
  {
    name: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
    address: '1e Eeldepad 3A, 2541 JG Den Haag',
    googleMapsUrl: 'https://maps.google.com/?q=Foundation+Morgenstond+Meeting+Center',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19633.662233915762!2d4.27553815!3d52.03952855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b1458bed8161%3A0x7923b95b272188be!2sFoundation%20Morgenstond%20Meeting%20Center!5e0!3m2!1sen!2snl!4v1769978609484!5m2!1sen!2snl',
    coordinates: {
      latitude: 52.0395,
      longitude: 4.2755,
    },
    imageFile: 'morgenstond.jpg',
    imageAlt: 'Stichting Morgenstond Ontmoetingcentrum',
  },
];

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting locations seed...');

  for (const item of locationsData) {
    try {
      let locationImageId: string | number | undefined;

      const imagePath = path.resolve(__dirname, '../../assets/images/location', item.imageFile);
      if (fs.existsSync(imagePath)) {
        const fileBuffer = fs.readFileSync(imagePath);
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: item.imageAlt,
            category: 'location',
          },
          file: {
            data: fileBuffer,
            name: item.imageFile,
            mimetype: 'image/jpeg',
            size: fileBuffer.byteLength,
          },
        });
        locationImageId = mediaDoc.id;
        console.info(`Uploaded image for ${item.name}: ${locationImageId}`);
      } else {
        console.warn(`Image not found for ${item.name}: ${imagePath}`);
      }

      const data: Record<string, unknown> = {
        name: item.name,
        address: item.address,
        googleMapsUrl: item.googleMapsUrl,
        mapEmbedUrl: item.mapEmbedUrl,
        coordinates: item.coordinates,
      };
      if (locationImageId) data.locationImage = locationImageId;

      await payload.create({
        collection: 'locations',
        data,
      });

      console.info(`Created location: ${item.name}`);
    } catch (error) {
      console.error(`Failed to create location ${item.name}:`, error);
    }
  }

  console.info('Locations seed complete.');
};