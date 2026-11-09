import test from 'node:test';
import assert from 'node:assert/strict';

import {
    createTodoSchema,
    updateTodoSchema,
    idParamSchema,
    listQuerySchema,
} from '../src/validations/todo.validation.js';

const firstType = (schema, data, options) => {
    const { error } = schema.validate(data, options);
    return error?.details[0].type;
};

test('createTodoSchema: body hợp lệ được trim', () => {
    const { error, value } = createTodoSchema.validate({ name: '  học  ' });
    assert.equal(error, undefined);
    assert.equal(value.name, 'học');
});

test('createTodoSchema: thiếu name -> any.required', () => {
    assert.equal(firstType(createTodoSchema, {}), 'any.required');
});

test('createTodoSchema: name rỗng -> string.empty', () => {
    assert.equal(firstType(createTodoSchema, { name: '' }), 'string.empty');
});

test('createTodoSchema: name quá dài -> string.max', () => {
    assert.equal(firstType(createTodoSchema, { name: 'a'.repeat(256) }), 'string.max');
});

test('createTodoSchema: name là số -> string.base', () => {
    assert.equal(firstType(createTodoSchema, { name: 123 }), 'string.base');
});

test('createTodoSchema: control char -> string.pattern.base', () => {
    assert.equal(firstType(createTodoSchema, { name: 'a\u0000b' }), 'string.pattern.base');
});

test('createTodoSchema: field lạ (validate trực tiếp) -> object.unknown', () => {
    assert.equal(
        firstType(createTodoSchema, { name: 'a', isAdmin: true }),
        'object.unknown',
    );
});

test('updateTodoSchema: {} -> object.min', () => {
    assert.equal(firstType(updateTodoSchema, {}), 'object.min');
});

test('updateTodoSchema: name rỗng -> string.empty', () => {
    assert.equal(firstType(updateTodoSchema, { name: '' }), 'string.empty');
});

test('updateTodoSchema: name hợp lệ -> OK', () => {
    const { error, value } = updateTodoSchema.validate({ name: 'x' });
    assert.equal(error, undefined);
    assert.equal(value.name, 'x');
});

test('idParamSchema: "5" -> convert thành 5', () => {
    const { error, value } = idParamSchema.validate({ id: '5' }, { convert: true });
    assert.equal(error, undefined);
    assert.equal(value.id, 5);
});

test('idParamSchema: "0" -> number.positive', () => {
    assert.equal(firstType(idParamSchema, { id: '0' }, { convert: true }), 'number.positive');
});

test('idParamSchema: 0 -> number.positive', () => {
    assert.equal(firstType(idParamSchema, { id: 0 }), 'number.positive');
});

test('idParamSchema: "abc" -> number.base', () => {
    assert.equal(firstType(idParamSchema, { id: 'abc' }, { convert: true }), 'number.base');
});

test('idParamSchema: "1.5" -> number.integer', () => {
    assert.equal(firstType(idParamSchema, { id: '1.5' }, { convert: true }), 'number.integer');
});

test('idParamSchema: vượt INT -> number.max', () => {
    assert.equal(
        firstType(idParamSchema, { id: '2147483648' }, { convert: true }),
        'number.max',
    );
});

test('listQuerySchema: {} -> default page=1 limit=10', () => {
    const { error, value } = listQuerySchema.validate({});
    assert.equal(error, undefined);
    assert.deepEqual(value, { page: 1, limit: 10 });
});

test('listQuerySchema: page=0 -> number.min', () => {
    assert.equal(firstType(listQuerySchema, { page: '0' }, { convert: true }), 'number.min');
});

test('listQuerySchema: limit=101 -> number.max', () => {
    assert.equal(firstType(listQuerySchema, { limit: '101' }, { convert: true }), 'number.max');
});

test('listQuerySchema: convert chuỗi thành số', () => {
    const { error, value } = listQuerySchema.validate(
        { page: '2', limit: '5' },
        { convert: true },
    );
    assert.equal(error, undefined);
    assert.deepEqual(value, { page: 2, limit: 5 });
});
