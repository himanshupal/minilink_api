import { FastifySchema } from "fastify";

export const LinkSchema: FastifySchema = {
	params: {
		username: {
			type: "string",
			minLength: 3,
		},
		count: {
			type: "number",
		},
	},
	querystring: {
		follow: {
			type: "boolean",
		},
	},
};
