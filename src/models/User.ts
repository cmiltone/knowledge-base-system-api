import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { DefaultDocument } from '../types/mongoose';

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    es_indexed: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    es_indexed: true,
  },
  phoneNumber: { type: String, required:true, unique: true },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'expert', 'admin'],
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'blocked'],
  },
  password: { type: String, required: true, select: false },
},
{ timestamps: true });

type UserDocument = DefaultDocument & User;

userSchema.plugin(mongoosePaginate);

export const UserModel = model<UserDocument, PaginateModel<UserDocument>>('User',userSchema);
