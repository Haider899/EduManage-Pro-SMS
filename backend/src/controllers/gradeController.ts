import { Request, Response } from 'express';
import Grade from '../models/Grade';

export const getAllGrades = async (req: Request, res: Response) => {
  try {
    const { studentId, classId, subject } = req.query;
    const query: any = {};

    if (studentId) query.student = studentId;
    if (classId) query.class = classId;
    if (subject) query.subject = subject;

    const grades = await Grade.find(query)
      .populate('student')
      .populate('class')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grades',
      error,
    });
  }
};

export const createGrade = async (req: Request, res: Response) => {
  try {
    const grade = new Grade(req.body);
    await grade.save();
    res.status(201).json({
      success: true,
      data: grade,
      message: 'Grade created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating grade',
      error,
    });
  }
};

export const updateGrade = async (req: Request, res: Response) => {
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      success: true,
      data: grade,
      message: 'Grade updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating grade',
      error,
    });
  }
};
