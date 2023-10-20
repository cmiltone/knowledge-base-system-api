import { injectable } from 'inversify';
import _ from 'lodash';

import { UserModel } from '../models/User';
import { PaginateResult } from 'mongoose';
import { PageOptions, Query } from '../types/mongoose';

@injectable()
export class UserService {
  async update(
    userId: string,
    update: {
      fullName?: User['fullName'];
      phoneNumber?: User['phoneNumber'];
      email?: User['email'];
      role?: User['role'];
      status?: User['status'];
    },
  ): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error('User not found');

    const updatedUser = await UserModel.findByIdAndUpdate(userId, _.pickBy(update), { new: true })

    return updatedUser;
  }

  async findById(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error('User not found');

    return user;
  }

  async delete(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error('User not found');

    await UserModel.findByIdAndDelete(userId);

    return user;
  }

  async page(query: Query, options: PageOptions): Promise<PaginateResult<User>> {
    const page = await UserModel.paginate<User, PageOptions>(query, options);

    return page;
  }
}
