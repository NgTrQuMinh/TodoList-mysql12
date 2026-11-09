import express from 'express';
import TodosController from '../controller/TodosController.js';

import { validate, validateParams, validateQuery } from '../middleware/validate.js';
import { createTodoSchema, updateTodoSchema, idParamSchema, listQuerySchema, } from '../validations/todo.validation.js';

const router = express.Router();

router.get('/', validateQuery(listQuerySchema), TodosController.getAllTodos);
router.get('/:id', validateParams(idParamSchema), TodosController.getTodoById);
router.post('/', validate(createTodoSchema), TodosController.createTodo);
router.put('/:id', validateParams(idParamSchema), validate(updateTodoSchema), TodosController.updateTodo);
router.delete('/:id', validateParams(idParamSchema), TodosController.deleteTodo);

export default router;
