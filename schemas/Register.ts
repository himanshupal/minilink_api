import { FastifySchema } from "fastify";

export const RegisterSchema: FastifySchema = {
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
		},
		required: ["username", "password"],
	},
};
