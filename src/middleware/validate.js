import { AppError } from '../utils/appError.js';

// Gom toàn bộ message lỗi của Joi thành 1 chuỗi để trả về cho client.
const buildMessage = (error) => error.details.map((d) => d.message).join(', ');

// Middleware validate req.body (dùng cho POST/PUT).
export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // trả về tất cả lỗi thay vì dừng ở lỗi đầu tiên
        stripUnknown: true, // loại bỏ field không khai báo (chống mass-assignment)
    });

    if (error) {
        return next(new AppError(buildMessage(error), 400));
    }

    // Gán lại body đã được làm sạch (trim, bỏ field lạ) rồi đi tiếp.
    req.body = value;
    next();
};

// Middleware validate req.params (dùng cho :id trên GET/PUT/DELETE).
export const validateParams = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.params, {
        abortEarly: false,
        convert: true, // Joi tự ép "1" -> 1 để kiểm tra kiểu number
    });

    if (error) {
        return next(new AppError(buildMessage(error), 400));
    }

    // Không gán lại req.params (tránh vấn đề read-only của Express 5),
    // controller vẫn dùng Number(req.params.id).
    next();
};
