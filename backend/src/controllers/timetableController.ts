import { Request, Response } from 'express';
import prisma from '../db';

const parseTimeStringToDate = (timeStr: string) => {
  if (!timeStr) return new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const formatTimeToStr = (dateVal: Date | string | null) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  return d.toTimeString().split(' ')[0].slice(0, 5);
};

export const getTimetable = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const where: any = {};
    if (classId) where.class_id = classId as string;

    const slots = await prisma.timetable.findMany({
      where,
      include: {
        teachers: true,
        classes: true
      },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' }
      ]
    });

    const mapped = slots.map(slot => ({
      id: slot.id,
      class: slot.classes ? {
        id: slot.classes.id,
        name: slot.classes.name,
        section: slot.classes.section
      } : null,
      classId: slot.class_id,
      dayOfWeek: slot.day_of_week,
      subject: slot.subject,
      teacher: slot.teachers ? {
        id: slot.teachers.id,
        firstName: slot.teachers.first_name,
        lastName: slot.teachers.last_name
      } : null,
      teacherId: slot.teacher_id,
      startTime: formatTimeToStr(slot.start_time),
      endTime: formatTimeToStr(slot.end_time),
      room: slot.room,
      academicYear: slot.academic_year,
      createdAt: slot.created_at,
      updatedAt: slot.updated_at
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching timetable', error });
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const { classId, class: reqClass, dayOfWeek, subject, teacherId, teacher: reqTeacher, startTime, endTime, room, academicYear, schoolId } = req.body;
    const finalClassId = classId || reqClass;
    const finalTeacherId = teacherId || reqTeacher;

    const slot = await prisma.timetable.create({
      data: {
        school_id: schoolId || null,
        class_id: finalClassId,
        day_of_week: Number(dayOfWeek),
        subject,
        teacher_id: finalTeacherId || null,
        start_time: parseTimeStringToDate(startTime),
        end_time: parseTimeStringToDate(endTime),
        room,
        academic_year: academicYear
      }
    });

    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating slot', error });
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { classId, class: reqClass, dayOfWeek, subject, teacherId, teacher: reqTeacher, startTime, endTime, room, academicYear } = req.body;
    const finalClassId = classId || reqClass;
    const finalTeacherId = teacherId || reqTeacher;

    const data: any = {};
    if (finalClassId) data.class_id = finalClassId;
    if (dayOfWeek !== undefined) data.day_of_week = Number(dayOfWeek);
    if (subject) data.subject = subject;
    if (finalTeacherId !== undefined) data.teacher_id = finalTeacherId || null;
    if (startTime) data.start_time = parseTimeStringToDate(startTime);
    if (endTime) data.end_time = parseTimeStringToDate(endTime);
    if (room) data.room = room;
    if (academicYear) data.academic_year = academicYear;

    const slot = await prisma.timetable.update({
      where: { id },
      data
    });

    res.json({ success: true, data: slot });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating slot', error });
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.timetable.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Slot deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting slot', error });
  }
};

export const bulkUpdate = async (req: Request, res: Response) => {
  try {
    const { slots, classId, academicYear, schoolId } = req.body;
    if (!Array.isArray(slots)) {
      return res.status(400).json({ success: false, message: 'Slots array required' });
    }

    const where: any = {};
    if (classId) where.class_id = classId;
    if (academicYear) where.academic_year = academicYear;

    await prisma.timetable.deleteMany({ where });

    const marks = slots.map((s: any) => ({
      school_id: schoolId || null,
      class_id: classId || s.classId || s.class,
      day_of_week: Number(s.dayOfWeek || s.day_of_week),
      subject: s.subject,
      teacher_id: s.teacherId || s.teacher || null,
      start_time: parseTimeStringToDate(s.startTime || s.start_time),
      end_time: parseTimeStringToDate(s.endTime || s.end_time),
      room: s.room,
      academic_year: academicYear || s.academicYear || s.academic_year
    }));

    await prisma.timetable.createMany({
      data: marks
    });

    const created = await prisma.timetable.findMany({
      where: {
        class_id: classId,
        academic_year: academicYear
      },
      include: {
        teachers: true,
        classes: true
      }
    });

    return res.json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error bulk updating timetable', error });
  }
};
