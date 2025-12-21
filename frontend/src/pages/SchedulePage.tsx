import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Clock } from 'lucide-react'; 
import type { Schedule } from '../types/payload-types';

const dayOrder = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    api.get('/schedule?limit=100')
       .then((res) => setSchedule(res.data.docs))
       .catch((err) => console.error("Failed to load schedule", err));
  }, []);

  // Group classes by "day"
  const grouped = schedule.reduce((acc, curr) => {
    const day = curr.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(curr);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // Sort classes by startTime inside each day
  Object.keys(grouped).forEach(day => {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="container mx-auto px-6 py-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          📅 Trainingsrooster
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Lessen & Schema</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          Wij geven judo les op maandag, woensdag, donderdag en zaterdag
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dayOrder.map((day) => {
          const classes = grouped[day];
          if (!classes) return null;

          return (
            <div key={day} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              <div className="flex items-center mb-6 border-l-4 border-judo-red pl-4">
                <h3 className="text-2xl font-bold text-gray-900">{day}</h3>
              </div>
              
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-light-gray rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Time */}
                    <div className="flex items-center gap-3 text-judo-red font-semibold min-w-[140px]">
                      <Clock size={18} />
                      <span>{cls.startTime} - {cls.endTime}</span>
                    </div>
                    {/* Class Info */}
                    <div className="flex flex-col">
                      <strong className="text-lg text-gray-800 font-bold">{cls.groupName}</strong>
                      {cls.instructor && (
                        <span className="text-sm text-judo-gray mt-1">{cls.instructor}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};