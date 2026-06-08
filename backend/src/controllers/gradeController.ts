import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllGrades = async (req: Request, res: Response) => {
  try {
    const { studentId, classId, subject } = req.query;

    const grades = await prisma.grades.findMany({
      where: {
        ...(studentId ? { student_id: studentId as string } : {}),
        ...(classId ? { class_id: classId as string } : {}),
        ...(subject ? { subject: subject as string } : {}),
      },
      include: {
        students: {
          select: { id: true, first_name: true, last_name: true, roll_number: true }
        },
        classes: {
          select: { id: true, name: true, section: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const mapped = grades.map(g => ({
      id: g.id,
      subject: g.subject,
      semester: g.semester,
      term: g.term,
      marks: g.marks,
      maxMarks: g.max_marks,
      percentage: g.percentage,
      grade: g.grade,
      remarks: g.remarks,
      basedOn: g.based_on,
      student: g.students
        ? {
            id: g.students.id,
            firstName: g.students.first_name,
            lastName: g.students.last_name,
            rollNumber: g.students.roll_number
          }
        : null,
      class: g.classes
        ? { id: g.classes.id, name: g.classes.name, section: g.classes.section }
        : null,
      createdAt: g.created_at,
      updatedAt: g.updated_at
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching grades', error });
  }
};

export const createGrade = async (req: AuthRequest, res: Response) => {
  try {
    const {
      studentId, classId, schoolId, subject, semester, term,
      marks, maxMarks, percentage, grade, remarks, basedOn
    } = req.body;

    const newGrade = await prisma.grades.create({
      data: {
        school_id: schoolId || null,
        student_id: studentId,
        class_id: classId,
        subject,
        semester,
        term,
        marks: parseFloat(marks),
        max_marks: parseFloat(maxMarks),
        percentage: parseFloat(percentage),
        grade,
        remarks: remarks || null,
        based_on: basedOn || null
      }
    });

    res.status(201).json({
      success: true,
      data: newGrade,
      message: 'Grade created successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating grade', error });
  }
};

export const updateGrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      subject, semester, term, marks, maxMarks,
      percentage, grade, remarks, basedOn
    } = req.body;

    const updated = await prisma.grades.update({
      where: { id },
      data: {
        ...(subject !== undefined && { subject }),
        ...(semester !== undefined && { semester }),
        ...(term !== undefined && { term }),
        ...(marks !== undefined && { marks: parseFloat(marks) }),
        ...(maxMarks !== undefined && { max_marks: parseFloat(maxMarks) }),
        ...(percentage !== undefined && { percentage: parseFloat(percentage) }),
        ...(grade !== undefined && { grade }),
        ...(remarks !== undefined && { remarks }),
        ...(basedOn !== undefined && { based_on: basedOn })
      }
    });

    res.json({ success: true, data: updated, message: 'Grade updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating grade', error });
  }
};
