import express from 'express';
import { getAllTagsASCOrder } from '../models/tagsModels';

export const getAllTags = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const tags = await getAllTagsASCOrder();
    res.status(200).json(tags.rows);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
