import { File } from "./file";

type Category = {
    _id?: string;
    name: string;
    description: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

type Article = {
    _id?: string;
    title: string;
    content: string;
    creator: User | string;
    category: Category | string;
    status: string;
    media?: File[];
    createdAt?: Date;
    updatedAt?: Date;
};
