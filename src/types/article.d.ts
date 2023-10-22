import { Media } from "./media";

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
    media?: Media[]
    createdAt?: Date;
    updatedAt?: Date;
};
