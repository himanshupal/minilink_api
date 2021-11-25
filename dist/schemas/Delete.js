"use strict";
exports.__esModule = true;
exports.DeleteSchema = void 0;
exports.DeleteSchema = {
    params: {
        id: {
            type: "string",
            length: 16
        }
    },
    body: {
        type: "object",
        properties: {
            password: {
                type: "string",
                minLength: 7
            }
        },
        required: ["password"]
    }
};
