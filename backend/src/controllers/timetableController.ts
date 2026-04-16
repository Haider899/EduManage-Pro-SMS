import { Request, Response } from 'express';
import Timetable from '../models/Timetable';

export const getTimetable = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const query: any = {};
    if (classId) query.class = classId;

    const slots = await Timetable.find(query).populate('teacher').populate('class').sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching timetable', error });
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const slot = new Timetable(req.body);
    await slot.save();
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating slot', error });
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slot = await Timetable.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: slot });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating slot', error });
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Timetable.findByIdAndDelete(id);
    res.json({ success: true, message: 'Slot deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting slot', error });
  }
};

export const bulkUpdate = async (req: Request, res: Response) => {
  try {
    const { slots, classId, academicYear } = req.body;
    if (!Array.isArray(slots)) {
      return res.status(400).json({ success: false, message: 'Slots array required' });
    }

    const filter: any = {};
    if (classId) filter.class = classId;
    if (academicYear) filter.academicYear = academicYear;

    await Timetable.deleteMany(filter);
    const created = await Timetable.insertMany(slots.map((s: any) => ({ ...s, class: classId, academicYear })));
    return res.json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error bulk updating timetable', error });
  }
};
