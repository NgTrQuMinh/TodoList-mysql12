import Joi from 'joi';

// Chặn ký tự điều khiển (\u0000-\u001F, \u007F) trong chuỗi.
const NO_CONTROL_CHARS = /^[^\u0000-\u001F\u007F]*$/;

// Schema cho POST /todos: bắt buộc có name, tự trim, độ dài 1-255.
export const createTodoSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .pattern(NO_CONTROL_CHARS)
        .required()
        .label('Tên'),
});

// Schema cho PUT /todos/:id: name là tùy chọn (cập nhật từng phần),
// nhưng body phải có ít nhất 1 field (.min(1)) để tránh gửi {} vô nghĩa.
export const updateTodoSchema = Joi.object({
    name: Joi.string().trim().min(1).max(255).pattern(NO_CONTROL_CHARS).label('Tên'),
}).min(1).label('Dữ liệu cập nhật');

// Schema cho param :id: số nguyên dương trong giới hạn INT của MySQL.
export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().max(2147483647).required().label('ID'),
});
