import express from 'express';
import TodosController from '../controller/TodosController.js';

import { validate } from '../middleware/validate.js';
import { createTodoSchema, updateTodoSchema } from '../validations/todo.validation.js';

const router = express.Router();

router.get('/', TodosController.getAllTodos);
router.get('/:id', TodosController.getTodoById);
router.post('/', validate(createTodoSchema), TodosController.createTodo);
router.put('/:id', validate(updateTodoSchema), TodosController.updateTodo);
router.delete('/:id', TodosController.deleteTodo);

export default router;
