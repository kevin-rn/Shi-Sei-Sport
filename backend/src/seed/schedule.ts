import type { Payload } from 'payload';

const scheduleData = [
  // MAANDAG - Hoofdlocatie
  {
    day: 'monday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '17:00',
    endTime: '18:00',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'monday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '18:00',
    endTime: '19:00',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'monday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '19:00',
    endTime: '20:00',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'monday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '20:00',
    endTime: '21:15',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },

  // WOENSDAG - Hoofdlocatie
  {
    day: 'wednesday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '14:00',
    endTime: '15:00',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'wednesday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '15:00',
    endTime: '16:00',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'wednesday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '16:00',
    endTime: '17:00',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'wednesday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '17:00',
    endTime: '18:00',
    locationName: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },

  // DONDERDAG - SBO de Springplank
  {
    day: 'thursday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '17:00',
    endTime: '18:00',
    locationName: 'SBO de Springplank',
  },
  {
    day: 'thursday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '18:00',
    endTime: '19:00',
    locationName: 'SBO de Springplank',
  },
  {
    day: 'thursday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '19:00',
    endTime: '20:00',
    locationName: 'SBO de Springplank',
  },
  {
    day: 'thursday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '20:00',
    endTime: '21:00',
    locationName: 'SBO de Springplank',
  },

  // ZATERDAG - SBO de Springplank
  {
    day: 'saturday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '09:30',
    endTime: '10:30',
    locationName: 'SBO de Springplank',
  },
  {
    day: 'saturday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '10:30',
    endTime: '11:30',
    locationName: 'SBO de Springplank',
  },
  {
    day: 'saturday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '11:30',
    endTime: '12:30',
    locationName: 'SBO de Springplank',
  },
  {
    day: 'saturday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '12:30',
    endTime: '13:30',
    locationName: 'SBO de Springplank',
  },
];

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting schedule seed...');


  const locations = await payload.find({ collection: 'locations', limit: 100 });
  for (const item of scheduleData) {
    try {
      const locationDoc = locations.docs.find((loc: any) =>
        loc.name === item.locationName
      );

      // Create the document in the default locale (Dutch) first
      const doc = await payload.create({
        collection: 'training-schedule',
        locale: 'nl',
        data: {
          day: item.day as any, // 'monday', 'tuesday', etc.
          groupName: item.groupName.nl,
          startTime: item.startTime,
          endTime: item.endTime,
          location: locationDoc?.id || null,
        },
      });

      // Then update it with the English translation
      await payload.update({
        collection: 'training-schedule',
        id: doc.id,
        locale: 'en',
        data: {
          groupName: item.groupName.en,
        },
      });

      console.info(`Created schedule: ${item.day} - ${item.groupName.nl}`);
    } catch (error) {
      console.error(`Failed to create schedule for ${item.day}:`, error);
    }
  }
  console.info('Schedule seed complete.');
};