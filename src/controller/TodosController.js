import TodosServices from '../services/TodosServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/sendResponse.js';

const TodosController = {
    getAllTodos: asyncHandler(async (req, res) => {
        const { page, limit } = req.validatedQuery;
        const result = await TodosServices.getAllTodos({ page, limit });
        sendResponse(res, 200, result);
    }),

    getTodoById: asyncHandler(async (req, res) => {
        const todo = await TodosServices.getTodoById(Number(req.params.id));
        sendResponse(res, 200, todo);
    }),

    createTodo: asyncHandler(async (req, res) => {
        const todo = await TodosServices.createTodo(req.body);
        sendResponse(res, 201, todo);
    }),

    updateTodo: asyncHandler(async (req, res) => {
        const todo = await TodosServices.updateTodo(Number(req.params.id), req.body);
        sendResponse(res, 200, todo);
    }),

    deleteTodo: asyncHandler(async (req, res) => {
        await TodosServices.deleteTodo(Number(req.params.id));
        res.status(204).end();
    }),
};

export default TodosController;
