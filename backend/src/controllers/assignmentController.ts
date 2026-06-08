import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { title, classId, class: reqClass, due, description, attachments, schoolId } = req.body;
    const finalClassId = classId || reqClass;

    const assignment = await prisma.assignments.create({
      data: {
        school_id: schoolId || null,
        title,
        class_id: finalClassId,
        due: due ? new Date(due) : null,
        description,
        attachments: attachments || [],
        created_by_user_id: req.user.id
      }
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating assignment', error });
  }
};

export const getAssignments = async (_req: Request, res: Response) => {
  try {
    const assignmentsList = await prisma.assignments.findMany({
      include: {
        profiles: {
          select: { id: true, name: true, role: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Map profiles to author / createdBy for frontend compatibility
    const mapped = assignmentsList.map(a => ({
      id: a.id,
      title: a.title,
      class: a.class_id,
      due: a.due,
      description: a.description,
      attachments: a.attachments,
      createdBy: a.profiles,
      createdAt: a.created_at,
      updatedAt: a.updated_at
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.assignments.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting assignment', error });
  }
};
