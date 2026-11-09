import test from 'node:test';
import assert from 'node:assert/strict';

import { validate, validateParams, validateQuery } from '../src/middleware/validate.js';
import {
    createTodoSchema,
    idParamSchema,
    listQuerySchema,
} from '../src/validations/todo.validation.js';

// Chạy middleware với req giả, trả về lỗi mà next() nhận (hoặc undefined).
function run(mw, req) {
    return new Promise((resolve) => mw(req, {}, (err) => resolve(err)));
}

test('validate: body hợp lệ -> next() không lỗi, body được trim', async () => {
    const req = { body: { name: '  ok  ' } };
    const err = await run(validate(createTodoSchema), req);

    assert.equal(err, undefined);
    assert.equal(req.body.name, 'ok');
});

test('validate: body thiếu name -> 400 với message tiếng Việt', async () => {
    const req = { body: {} };
    const err = await run(validate(createTodoSchema), req);

    assert.equal(err.status, 400);
    assert.equal(err.message, '"Tên" là bắt buộc');
});

test('validate: field lạ qua middleware -> 400 (allowUnknown: false)', async () => {
    const req = { body: { name: 'a', isAdmin: true } };
    const err = await run(validate(createTodoSchema), req);

    assert.equal(err.status, 400);
    assert.equal(err.message, '"isAdmin" không được phép');
});

test('validateParams: id="abc" -> 400 với message tiếng Việt', async () => {
    const req = { params: { id: 'abc' } };
    const err = await run(validateParams(idParamSchema), req);

    assert.equal(err.status, 400);
    assert.equal(err.message, '"ID" phải là số');
});

test('validateParams: id="5" -> hợp lệ, không đổi req.params', async () => {
    const req = { params: { id: '5' } };
    const err = await run(validateParams(idParamSchema), req);

    assert.equal(err, undefined);
    assert.deepEqual(req.params, { id: '5' });
});

test('validateQuery: {} -> mặc định page=1 limit=10 ở req.validatedQuery', async () => {
    const req = { query: {} };
    const err = await run(validateQuery(listQuerySchema), req);

    assert.equal(err, undefined);
    assert.deepEqual(req.validatedQuery, { page: 1, limit: 10 });
});

test('validateQuery: page=0 -> 400 với message tiếng Việt', async () => {
    const req = { query: { page: '0' } };
    const err = await run(validateQuery(listQuerySchema), req);

    assert.equal(err.status, 400);
    assert.equal(err.message, '"Trang" phải lớn hơn hoặc bằng 1');
});

test('validateQuery: không làm thay đổi req.query', async () => {
    const req = { query: { page: '2', limit: '5' } };
    await run(validateQuery(listQuerySchema), req);

    assert.deepEqual(req.query, { page: '2', limit: '5' });
    assert.deepEqual(req.validatedQuery, { page: 2, limit: 5 });
});
