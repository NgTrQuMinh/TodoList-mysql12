import Joi from 'joi';

// Schema cho POST /todos: bắt buộc có name, tự trim, độ dài 1-255.
export const createTodoSchema = Joi.object({
    name: Joi.string().trim().min(1).max(255).required().label('Tên'),
});

// Schema cho PUT /todos/:id: name là tùy chọn (cập nhật từng phần),
// nhưng body phải có ít nhất 1 field (.min(1)) để tránh gửi {} vô nghĩa.
export const updateTodoSchema = Joi.object({
    name: Joi.string().trim().min(1).max(255).label('Tên'),
}).min(1).label('Dữ liệu cập nhật');

// Schema cho param :id: phải là số nguyên dương (vd: 1, 42).
export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().label('ID'),
});
