"use strict";
exports.__esModule = true;
exports.CreateSchema = void 0;
exports.CreateSchema = {
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
            },
            url: {
                type: "string",
                format: "url"
            },
            info: {
                type: "string"
            },
            expireAt: {
                type: "string"
            }
        },
        required: ["username", "password", "url", "info"]
    }
};
