import Todos from '../model/Todos.js';
import { AppError } from '../utils/appError.js';

const TodosServices = {
    getAllTodos: async ({ page, limit }) => {
        const offset = (page - 1) * limit;
        const [items, total] = await Promise.all([
            Todos.getAllTodos({ limit, offset }),
            Todos.countTodos(),
        ]);

        return {
            items,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },

    getTodoById: async (id) => {
        const todo = await Todos.getTodoById(id);
        if (!todo) throw new AppError('Không tìm thấy todo', 404);
        return todo;
    },

    createTodo: async (data) => {
        return Todos.createTodo(data);
    },

    updateTodo: async (id, data) => {
        const todo = await Todos.getTodoById(id);
        if (!todo) throw new AppError('Không tìm thấy todo', 404);
        return Todos.updateTodo(id, { ...todo, ...data });
    },

    deleteTodo: async (id) => {
        const deleted = await Todos.deleteTodo(id);
        if (!deleted) throw new AppError('Không tìm thấy todo', 404);
    },
};

export default TodosServices;