import { Article } from "./article";

type Media = {
    _id?: string;
    title: string;
    article: string | Article;
    ext: string;
    mime: string;
    type: 'image' | 'video';
    thumbnail: string;
    filename: string;
    size: number;
    dimensions?: {
        height: number;
        width: number;
        orientation: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
};
