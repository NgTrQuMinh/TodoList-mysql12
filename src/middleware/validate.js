import { AppError } from '../utils/appError.js';
import { viMessages } from '../validations/messages.js';

// Gom toàn bộ message lỗi của Joi thành 1 chuỗi để trả về cho client.
const buildMessage = (error) => error.details.map((d) => d.message).join(', ');

// Middleware validate req.body (dùng cho POST/PUT).
export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // trả về tất cả lỗi thay vì dừng ở lỗi đầu tiên
        allowUnknown: false, // field lạ -> lỗi 400 (chặn mass-assignment)
        messages: viMessages, // message lỗi tiếng Việt dùng chung
    });

    if (error) {
        return next(new AppError(buildMessage(error), 400));
    }

    // Gán lại body đã được làm sạch (trim) rồi đi tiếp.
    req.body = value;
    next();
};

// Middleware validate req.params (dùng cho :id trên GET/PUT/DELETE).
export const validateParams = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.params, {
        abortEarly: false,
        convert: true, // Joi tự ép "1" -> 1 để kiểm tra kiểu number
        stripUnknown: true,
        messages: viMessages,
    });

    if (error) {
        return next(new AppError(buildMessage(error), 400));
    }

    // Không gán lại req.params (tránh vấn đề read-only của Express 5),
    // controller vẫn dùng Number(req.params.id).
    next();
};

// Middleware validate req.query (dùng cho phân trang GET /todos).
export const validateQuery = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        convert: true, // "2" -> 2
        stripUnknown: true, // bỏ query param lạ
        messages: viMessages,
    });

    if (error) {
        return next(new AppError(buildMessage(error), 400));
    }

    // req.query là read-only ở Express 5 nên gắn giá trị đã validate vào req.validatedQuery.
    req.validatedQuery = value;
    next();
};
