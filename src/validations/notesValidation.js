import mongoose from 'mongoose';
import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';

const noteIdParamsSchema = Joi.object({
  noteId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }

      return value;
    })
    .required(),
});

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow('').default(''),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: noteIdParamsSchema,
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: noteIdSchema[Segments.PARAMS],
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
};
