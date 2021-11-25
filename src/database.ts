import { MongoClient, Collection } from "mongodb";
import { appName, databaseName } from "./config.json";

export const getClient = async (
	URI: string = `mongodb://localhost`
): Promise<MongoClient> => {
	const client: MongoClient = new MongoClient(process.env.MONGO_URI || URI, {
		appName,
	});
	return await client.connect();
};

export const ping = async (): Promise<boolean> => {
	try {
		await (await getClient()).close();
		return true;
	} catch (error) {
		return false;
	}
};

export const getCollection = async <T>(
	name: string,
	database: string = databaseName
): Promise<{ collection: Collection<T>; client: MongoClient }> => {
	const client = await getClient();

	return { collection: client.db(database).collection(name), client };
};
