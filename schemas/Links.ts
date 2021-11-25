import { FastifySchema } from "fastify";

export const LinksSchema: FastifySchema = {
	params: {
		username: {
			type: "string",
			minLength: 3,
		},
	},
};
