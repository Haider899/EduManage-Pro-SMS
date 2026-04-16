"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const emptyTimetable: Record<string, Array<any>> = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

const TimetablePage = () => {
  const { user } = useAuth();
  const canEdit = ['superadmin', 'hr', 'admin'].includes(user?.role || '');

  const [timetable, setTimetable] = useState<Record<string, Array<any>>>(emptyTimetable);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res: any = await api.get('/timetable');
      const slots: any[] = res.data || [];
      const map: Record<string, Array<any>> = { ...emptyTimetable };
      slots.forEach((s) => {
        const day = dayNames[s.dayOfWeek] || 'Monday';
        if (!map[day]) map[day] = [];
        map[day].push({
          _id: s._id,
          time: `${s.startTime} - ${s.endTime}`,
          subject: s.subject,
          teacher: s.teacher?.name || s.teacher,
          room: s.room,
        });
      });
      setTimetable(map);
    } catch (err: any) {
      toast.error('Failed to load timetable');
    }
  };

  const handleChange = (day: string, idx: number, field: string, value: string) => {
    setTimetable((prev) => {
      const copy = { ...prev };
      copy[day] = copy[day].map((c: any, i: number) => (i === idx ? { ...c, [field]: value } : c));
      return copy;
    });
  };

  const handleDelete = (day: string, idx: number) => {
    setTimetable((prev) => {
      const copy = { ...prev };
      copy[day] = copy[day].filter((_: any, i: number) => i !== idx);
      return copy;
    });
    toast.success('Slot removed');
  };

  const handleAddSlot = (day: string) => {
    setTimetable((prev) => {
      const copy = { ...prev };
      copy[day] = [
        ...copy[day],
        { time: '09:00 AM - 10:00 AM', subject: 'New Slot', teacher: 'TBD', room: '-' },
      ];
      return copy;
    });
  };

  const handleSave = async () => {
    try {
      // Flatten slots into array with dayOfWeek/startTime/endTime/etc.
      const slots: any[] = [];
      Object.entries(timetable).forEach(([day, classes]) => {
        const dayOfWeek = dayNames.indexOf(day);
        classes.forEach((c: any) => {
          // basic split of time
          let start = c.time || '';
          let end = '';
          if (c.time && c.time.includes('-')) {
            const parts = c.time.split('-').map((p: string) => p.trim());
            start = parts[0];
            end = parts[1] || '';
          }
          slots.push({
            class: c.class || null,
            dayOfWeek,
            subject: c.subject,
            teacher: c.teacher,
            startTime: start,
            endTime: end,
            room: c.room || '-',
            academicYear: c.academicYear || '2025-2026',
          });
        });
      });

      await api.post('/timetable/bulk', { slots, academicYear: '2025-2026' });
      toast.success('Timetable saved');
      // reflect returned data
      fetchTimetable();
      setIsEditing(false);
    } catch (err: any) {
      toast.error('Failed to save timetable');
    }
  };

  const handleCancel = () => {
    fetchTimetable();
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
                  <div className="flex flex-col lg:flex-row items-start gap-3 relative">
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

                      {isEditing && (
                        <button
                          onClick={() => handleDelete(day, clsIdx)}
                          className="absolute top-2 right-2 p-2 rounded-md text-red-400 hover:bg-white/5"
                          aria-label="Delete slot"
                        >
                          <FiTrash2 />
                        </button>
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

              {isEditing && (
                <div className="pt-2">
                  <button onClick={() => handleAddSlot(day)} className="btn-ghost btn-pill">
                    <FiPlus />
                    <span>Add Slot</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage;
