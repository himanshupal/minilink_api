import Fastify from "fastify";
import cors from "fastify-cors";
import { FastifyError } from "fastify-error";
import { STATUS_CODES } from "http";

import { getCollection } from "./database";
import { usersCollection, linksCollection, expireInDays } from "./config.json";
import { User, Link, Links, CreateLink, Error } from "../models";
import {
	RegisterSchema,
	CreateSchema,
	LinksSchema,
	LinkSchema,
	DeleteSchema,
} from "../schemas";
import { ObjectId } from "bson";

const PORT = process.env.PORT || 8000;

const fastify = Fastify();

fastify.register(cors);

fastify.get("/", async (_, reply) => {
	return reply.send(STATUS_CODES);
});

fastify.post<{ Body: User; Reply: User | Error }>(
	"/register",
	{ schema: RegisterSchema },
	async (request, reply) => {
		try {
			const { collection, client } = await getCollection<User>(usersCollection);

			const user = await collection.findOne({
				username: request.body.username,
			});
			if (user) {
				return reply
					.status(409)
					.send({ message: "Username already taken, please choose another" });
			}

			const docToSave: User = {
				...request.body,
				linksCreated: 0,
				createdAt: Date.now(),
				lastActive: Date.now(),
			};

			const { insertedId } = await collection.insertOne(docToSave);
			await client.close();

			delete docToSave.password;

			return reply.send({ ...docToSave, _id: insertedId });
		} catch (error: any) {
			const err: FastifyError = error;
			return reply.status(500).send({ message: err.message });
		}
	}
);

fastify.post<{ Body: CreateLink; Reply: Link | Error }>(
	"/create",
	{ schema: CreateSchema },
	async (request, reply) => {
		try {
			const { collection: users, client: usersClient } =
				await getCollection<User>(usersCollection);

			const author = await users.findOne({
				username: request.body.username,
				password: request.body.password,
			});

			if (!author) {
				await usersClient.close();
				return reply.status(401).send({ message: "Incorrect password!" });
			}

			const { collection, client } = await getCollection<Link>(linksCollection);

			const link = await collection.findOne({
				url: request.body.url,
				createdBy: request.body.username,
			});
			if (link) {
				return reply.status(409).send({
					message: `A link already exists with same url at #${link.count}`,
				});
			}

			const docToSave: Link = {
				url: request.body.url,
				info: request.body.info,
				count: author.linksCreated + 1,
				createdAt: Date.now(),
				createdBy: request.body.username,
				expireAt: new Date(
					request.body.expireAt ??
						Date.now() + 1000 * 60 * 60 * 24 * expireInDays
				).valueOf(),
			};

			const { insertedId } = await collection.insertOne(docToSave);
			await users.updateOne(
				{ _id: author._id },
				{ $inc: { linksCreated: 1 }, $set: { lastActive: Date.now() } }
			);

			await client.close();
			await usersClient.close();

			return reply.send({ ...docToSave, _id: insertedId });
		} catch (error: any) {
			const err: FastifyError = error;
			return reply.status(500).send({ message: err.message });
		}
	}
);

fastify.get<{
	Params: { username: string };
	Reply: Record<string, Links | User> | Error;
}>("/:username", { schema: LinksSchema }, async (request, reply) => {
	try {
		const username = request.params.username;

		const { collection: users, client: usersClient } =
			await getCollection<User>(usersCollection);

		const user = await users.findOne({ username });
		await usersClient.close();
		if (!user) {
			return reply.status(404).send({ message: "User not found!" });
		}

		const { collection, client } = await getCollection<Link>(linksCollection);
		const cursor = collection.find({ createdBy: username });

		let data: Links = [];
		await cursor.forEach((link) => {
			data.push(link);
		});
		await client.close();

		return { user, data };
	} catch (error: any) {
		const err: FastifyError = error;
		return reply.status(500).send({ message: err.message });
	}
});

fastify.get<{
	Params: { username: string; count: number };
	Querystring: { follow: boolean };
	Reply: Link | Error;
}>("/:username/:count", { schema: LinkSchema }, async (request, reply) => {
	try {
		const username = request.params.username;

		const { collection: users, client: usersClient } =
			await getCollection<User>(usersCollection);

		const user = await users.findOne({ username });
		await usersClient.close();
		if (!user) {
			return reply.status(404).send({ message: "User not found!" });
		}

		const { collection, client } = await getCollection<Link>(linksCollection);
		const link = await collection.findOne({
			createdBy: username,
			count: request.params.count,
		});

		await client.close();
		if (!link) {
			return reply.status(404).send({ message: "Link not found!" });
		}

		return request.query.follow ? reply.redirect(301, link.url) : link;
	} catch (error: any) {
		const err: FastifyError = error;
		return reply.status(500).send({ message: err.message });
	}
});

fastify.delete<{
	Params: { id: string };
	Body: { password: string };
	Reply: boolean | Error;
}>("/:id", { schema: DeleteSchema }, async (request, reply) => {
	try {
		const _id = new ObjectId(request.params.id);

		const { collection, client } = await getCollection<Link>(linksCollection);
		const link = await collection.findOne({ _id });
		if (!link) {
			return reply.status(404).send({ message: "Link not found!" });
		}

		const { collection: users, client: usersClient } =
			await getCollection<User>(usersCollection);
		const author = await users.findOne({
			username: link.createdBy,
			password: request.body.password,
		});
		if (!author) {
			await usersClient.close();
			return reply.status(401).send({ message: "Incorrect password!" });
		}

		await users.updateOne(
			{ _id: author._id },
			{ $set: { lastActive: Date.now() } }
		);
		await usersClient.close();

		const { deletedCount } = await collection.deleteOne({ _id });
		await client.close();

		return reply.send(!!deletedCount);
	} catch (error: any) {
		const err: FastifyError = error;
		return reply.status(500).send({ message: err.message });
	}
});

fastify.listen(PORT, (err, address) => {
	if (err) throw err;
	console.info(`Server started at ${address}`);
});
