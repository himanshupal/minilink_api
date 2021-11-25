import { FastifySchema } from "fastify";

export const CreateSchema: FastifySchema = {
	body: {
		type: "object",
		properties: {
			username: {
				type: "string",
				minLength: 3,
			},
			password: {
				type: "string",
				minLength: 7,
			},

			url: {
				type: "string",
				format: "url",
			},
			info: {
				type: "string",
			},
			expireAt: {
				type: "string",
			},
		},
		required: ["username", "password", "url", "info"],
	},
};
