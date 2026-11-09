import Joi from 'joi';

export const createTodoSchema = Joi.object({
    name: Joi.string().trim().min(1).max(255).required(),
});
