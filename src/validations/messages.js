// Bộ message tiếng Việt dùng chung cho mọi schema Joi.
// {{#label}} sẽ được thay bằng label của field (vd: "Tên", "ID").
export const viMessages = {
    'any.required': '{{#label}} là bắt buộc',
    'string.base': '{{#label}} phải là chuỗi',
    'string.empty': '{{#label}} không được để trống',
    'string.min': '{{#label}} phải có ít nhất {#limit} ký tự',
    'string.max': '{{#label}} không được vượt quá {#limit} ký tự',
    'string.pattern.base': '{{#label}} chứa ký tự không hợp lệ',
    'number.base': '{{#label}} phải là số',
    'number.integer': '{{#label}} phải là số nguyên',
    'number.positive': '{{#label}} phải là số dương',
    'number.max': '{{#label}} vượt quá giới hạn cho phép',
    'number.min': '{{#label}} phải lớn hơn hoặc bằng {{#limit}}',
    'object.min': '{{#label}} phải có ít nhất {#limit} trường',
    'object.unknown': '{{#label}} không được phép',
};
