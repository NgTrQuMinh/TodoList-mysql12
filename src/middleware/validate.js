import { AppError } from '../utils/appError.js';

// Middleware factory: nhận vào một Joi schema, trả về middleware cho Express.
// Nhờ vậy có thể tái sử dụng cho nhiều route với schema khác nhau.
export const validate = (schema) => (req, res, next) => {
    // Kiểm tra dữ liệu client gửi lên (req.body) theo schema.
    // abortEarly: false -> trả về TẤT CẢ lỗi thay vì dừng ở lỗi đầu tiên.
    // stripUnknown: true -> tự động loại bỏ field không khai báo trong schema (chống mass-assignment).
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    // Có lỗi validate -> gom toàn bộ message lại, chuyển cho errorHandler (trả về 400).
    if (error) {
        return next(new AppError(error.details.map((d) => d.message).join(', '), 400));
    }

    // Không lỗi -> gán lại body đã được làm sạch (trim, bỏ field lạ) rồi đi tiếp.
    req.body = value;
    next();
};
