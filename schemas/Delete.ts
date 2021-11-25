import { FastifySchema } from "fastify";

export const DeleteSchema: FastifySchema = {
	params: {
		id: {
			type: "string",
			length: 16,
		},
	},
	body: {
		type: "object",
		properties: {
			password: {
				type: "string",
				minLength: 7,
			},
		},
		required: ["password"],
	},
};
