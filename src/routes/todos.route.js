import express from 'express';
import TodosController from '../controller/TodosController.js';

const router = express.Router();

router.get('/', TodosController.getAllTodos);
router.get('/:id', TodosController.getTodoById);
router.post('/', TodosController.createTodo);
router.put('/:id', TodosController.updateTodo);
router.delete('/:id', TodosController.deleteTodo);

export default router;
