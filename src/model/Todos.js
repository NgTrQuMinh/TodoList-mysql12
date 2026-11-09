import { pool } from '../config/db.js';

const Todos = {
    getAllTodos: async () => {
        const [rows] = await pool.execute(
            'SELECT id, name, create_time FROM todos ORDER BY id DESC'
        );
        return rows;
    },

    getTodoById: async (id) => {
        const [rows] = await pool.execute(
            'SELECT id, name, create_time FROM todos WHERE id = ?',
            [id]
        );
        return rows[0] ?? null;
    },

    createTodo: async ({ name }) => {
        const [result] = await pool.execute(
            'INSERT INTO todos (name, create_time) VALUES (?, NOW())',
            [name]
        );
        return Todos.getTodoById(result.insertId);
    },

    updateTodo: async (id, { name }) => {
        await pool.execute(
            'UPDATE todos SET name = ? WHERE id = ?',
            [name, id]
        );
        return Todos.getTodoById(id);
    },

    deleteTodo: async (id) => {
        const [result] = await pool.execute(
            'DELETE FROM todos WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },
};

export default Todos;
