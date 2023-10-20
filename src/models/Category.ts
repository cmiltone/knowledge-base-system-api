import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { DefaultDocument } from '../types/mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    es_indexed: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive'],
  },
},
{ timestamps: true });

type CategoryDocument = DefaultDocument & Category;

categorySchema.plugin(mongoosePaginate);

categorySchema.index({ name: 'text', description: 'text' });

export const CategoryModel = model<CategoryDocument, PaginateModel<CategoryDocument>>('Category',categorySchema);
