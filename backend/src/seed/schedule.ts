import type { Payload } from 'payload';

const scheduleData = [
  // MAANDAG - Hoofdlocatie
  {
    day: 'Monday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '17:00',
    endTime: '18:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'Monday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '18:00',
    endTime: '19:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'Monday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '19:00',
    endTime: '20:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'Monday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '20:00',
    endTime: '21:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },

  // WOENSDAG - Hoofdlocatie
  {
    day: 'Wednesday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '14:00',
    endTime: '15:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'Wednesday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '15:00',
    endTime: '16:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'Wednesday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '16:00',
    endTime: '17:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },
  {
    day: 'Wednesday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '17:00',
    endTime: '18:00',
    location: 'Hoofdlocatie - Stichting Morgenstond Ontmoetingcentrum',
  },

  // DONDERDAG - SBO de Springplank
  {
    day: 'Thursday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '17:00',
    endTime: '18:00',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },
  {
    day: 'Thursday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '18:00',
    endTime: '19:00',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },
  {
    day: 'Thursday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '19:00',
    endTime: '20:00',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },
  {
    day: 'Thursday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '20:00',
    endTime: '21:00',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },

  // ZATERDAG - SBO de Springplank
  {
    day: 'Saturday',
    groupName: { nl: '4 t/m 6 jaar (tuimeljudo)', en: '4 to 6 years (Tumble Judo)' },
    startTime: '09:30',
    endTime: '10:30',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },
  {
    day: 'Saturday',
    groupName: { nl: '7 t/m 9 jaar', en: '7 to 9 years' },
    startTime: '10:30',
    endTime: '11:30',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },
  {
    day: 'Saturday',
    groupName: { nl: '10 t/m 12 jaar', en: '10 to 12 years' },
    startTime: '11:30',
    endTime: '12:30',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },
  {
    day: 'Saturday',
    groupName: { nl: '13 jaar en ouder', en: '13 years and older' },
    startTime: '12:30',
    endTime: '13:30',
    location: 'SBO de Springplank',
    instructor: 'TBD',
  },
];

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting schedule seed...');

  const locations = await payload.find({ collection: 'locations', limit: 100 });
  const instructorsList = await payload.find({ collection: 'instructors', limit: 100 });

  for (const item of scheduleData) {
    try {
      const location = locations.docs.find((loc: any) => loc.name === item.location);
      const instructor = instructorsList.docs.find((inst: any) => inst.name === item.instructor);

      // Create the document in the default locale first
      const doc = await payload.create({
        collection: 'schedule',
        locale: 'nl',
        data: {
          day: item.day,
          groupName: item.groupName.nl,
          startTime: item.startTime,
          endTime: item.endTime,
          instructors: instructor?.id || null, 
          location: location?.id || null,
        },
      });

      // Then update it with the English translation
      await payload.update({
        collection: 'schedule',
        id: doc.id,
        locale: 'en',
        data: {
          groupName: item.groupName.en,
        },
      });

      console.info(`Created localized schedule: ${item.day} - ${item.groupName.nl}`);
    } catch (error) {
      console.error(`Failed to create schedule for ${item.day}:`, error);
    }
  }
  console.info('Schedule seed complete.');
};