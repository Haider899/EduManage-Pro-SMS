'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

const initialTimetable: Record<string, Array<any>> = {
  Monday: [
    { time: '9:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Dr. Wilson', room: '101' },
    { time: '10:00 AM - 11:00 AM', subject: 'Science', teacher: 'Mr. Brown', room: '102' },
    { time: '11:00 AM - 12:00 PM', subject: 'English', teacher: 'Ms. Miller', room: '103' },
  ],
  Tuesday: [
    { time: '9:00 AM - 10:00 AM', subject: 'History', teacher: 'Dr. Davis', room: '201' },
    { time: '10:00 AM - 11:00 AM', subject: 'Geography', teacher: 'Ms. Anderson', room: '202' },
    { time: '11:00 AM - 12:00 PM', subject: 'Physics', teacher: 'Mr. Taylor', room: '203' },
  ],
};

const TimetablePage = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'superadmin' || user?.role === 'hr';

  const [timetable, setTimetable] = useState(initialTimetable);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (day: string, idx: number, field: string, value: string) => {
    setTimetable((prev) => {
      const copy = { ...prev };
      copy[day] = copy[day].map((c: any, i: number) => (i === idx ? { ...c, [field]: value } : c));
      return copy;
    });
  };

  const handleSave = async () => {
    // TODO: persist to backend when API exists
    setIsEditing(false);
    toast.success('Timetable saved (local only)');
    console.log('Saved timetable', timetable);
  };

  const handleCancel = () => {
    setTimetable(initialTimetable);
    setIsEditing(false);
    toast('Edits canceled');
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Timetable</h1>
          <p className="text-slate-400">View class schedule and timings</p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-accent px-4 py-2 rounded">Edit Timetable</button>
            ) : (
              <>
                <button onClick={handleSave} className="btn-accent px-4 py-2 rounded">Save</button>
                <button onClick={handleCancel} className="px-4 py-2 rounded border">Cancel</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(timetable).map(([day, classes], dayIdx) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIdx * 0.1 }}
            className="glass-effect rounded-xl p-6 border border-slate-700"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiCalendar size={20} />
              {day}
            </h2>

            <div className="space-y-4">
              {classes.map((cls: any, clsIdx: number) => (
                <motion.div
                  key={clsIdx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIdx * 0.1 + clsIdx * 0.05 }}
                  className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-4 rounded-lg hover:border-blue-400/50 transition"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-3">
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          value={cls.subject}
                          onChange={(e) => handleChange(day, clsIdx, 'subject', e.target.value)}
                          className="w-full bg-transparent border-b border-slate-700 pb-1 text-lg font-semibold"
                        />
                      ) : (
                        <p className="font-semibold text-lg mb-2">{cls.subject}</p>
                      )}

                      <div className="space-y-1 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <FiClock size={16} />
                          {isEditing ? (
                            <input
                              value={cls.time}
                              onChange={(e) => handleChange(day, clsIdx, 'time', e.target.value)}
                              className="bg-transparent border-b border-slate-700 pb-1"
                            />
                          ) : (
                            cls.time
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin size={16} />
                          {isEditing ? (
                            <input
                              value={cls.room}
                              onChange={(e) => handleChange(day, clsIdx, 'room', e.target.value)}
                              className="bg-transparent border-b border-slate-700 pb-1"
                            />
                          ) : (
                            `Room ${cls.room}`
                          )}
                        </div>
                        <p className="text-slate-400 mt-2">{isEditing ? (
                          <input
                            value={cls.teacher}
                            onChange={(e) => handleChange(day, clsIdx, 'teacher', e.target.value)}
                            className="bg-transparent border-b border-slate-700 pb-1"
                          />
                        ) : (
                          `Teacher: ${cls.teacher}`
                        )}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage;
