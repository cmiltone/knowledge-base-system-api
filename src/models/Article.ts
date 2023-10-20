import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { DefaultDocument } from '../types/mongoose';
import { fileSchema } from '../schema/file';
import { Article } from '../types/article';

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    es_indexed: true,
  },
  content: { type: String, required: true },
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  status: {
    type: String,
    default: 'draft',
    enum: ['published', 'draft', 'deleted'],
  },
  media: [fileSchema]
},
{ timestamps: true });

type ArticleDocument = DefaultDocument & Article;

articleSchema.plugin(mongoosePaginate);

articleSchema.index({ title: 'text', content: 'text' })

export const ArticleModel = model<ArticleDocument, PaginateModel<ArticleDocument>>('Article',articleSchema);
