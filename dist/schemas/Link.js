"use strict";
exports.__esModule = true;
exports.LinkSchema = void 0;
exports.LinkSchema = {
    params: {
        username: {
            type: "string",
            minLength: 3
        },
        count: {
            type: "number"
        }
    },
    querystring: {
        follow: {
            type: "boolean"
        }
    }
};
