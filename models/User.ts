import { ObjectId } from "bson";

export interface User {
	_id?: ObjectId;
	createdAt: Date | number;
	lastActive: Date | number;
	linksCreated: number;
	username: string;
	password?: string;
}

export type Users = Array<User>;
