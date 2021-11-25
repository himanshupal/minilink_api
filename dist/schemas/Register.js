"use strict";
exports.__esModule = true;
exports.RegisterSchema = void 0;
exports.RegisterSchema = {
    body: {
        type: "object",
        properties: {
            username: {
                type: "string",
                minLength: 3
            },
            password: {
                type: "string",
                minLength: 7
            }
        },
        required: ["username", "password"]
    }
};
