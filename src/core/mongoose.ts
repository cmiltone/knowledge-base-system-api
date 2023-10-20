import { Db } from 'mongodb';
import mongoose from 'mongoose';
import { MONGO_DB_URI } from '../config/mongoose';

export async function initDb(): Promise<Db> {
  const connection = await mongoose.connect(MONGO_DB_URI);

  return connection.connection.db;
}
