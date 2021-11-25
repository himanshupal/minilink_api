import { ObjectId } from "bson";

export interface Link {
	_id?: ObjectId;
	count: number;
	url: string;
	info: string;
	createdBy: string;
	createdAt: Date | number;
	expireAt: Date | number;
}

export interface CreateLink extends Link {
	username: string;
	password: string;
}

export type Links = Array<Link>;
