import { Request, Response } from 'express';
import Material from '../models/Material';

export const uploadMaterial = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, uploadedBy: req.user?._id };
    const m = new Material(payload);
    await m.save();
    res.status(201).json({ success: true, data: m });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error uploading material', error });
  }
};

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await Material.find().populate('uploadedBy').sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching materials', error });
  }
};
