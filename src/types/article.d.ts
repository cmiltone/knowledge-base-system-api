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

type Comment = {
    _id?: string;
    message: string;
    user: string | User;
    reply?: Comment;
    createdAt?: Date;
    updatedAt?: Date;
}

type Like = {
    _id?: string;
    user: string | User;
    createdAt?: Date;
    updatedAt?: Date;
}

type Engagement = {
    _id?: string;
    article: Article | string;
    comments: (string | Comment)[];
    likes: (string | Like)[];
    createdAt?: Date;
    updatedAt?: Date;
}
