import { injectable, inject } from 'inversify';
import { TokenService } from './token';
import { UserModel } from '../models/User';
import argon2 from 'argon2';

interface RegistrationInput {
  fullName: User['fullName'];
  email: User['email'];
  phoneNumber: User['phoneNumber'];
  password: User['password'];
}

interface AuthResult {
  user: User;
  token: string;
}

interface LoginInput {
  identifier: User['phoneNumber'] | User['email'] | string;
  password: User['password'];
}

@injectable()
export class AuthService {

  @inject(TokenService)
  private tokenService: TokenService;

  async register(data: RegistrationInput): Promise<AuthResult> {
    const { fullName, email, phoneNumber, password } = data;

    const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }]});

    if (existingUser) throw new Error('User already registered');

    const hash = await argon2.hash(password);

    const user = new UserModel({ phoneNumber, email, fullName, password: hash });

    user.save();

    delete user.password;

    const token = this.tokenService.encode({ _id: user.id, verified: true });

    return { user: user, token };
  }

  async login(data: LoginInput): Promise<AuthResult> {
    const { identifier, password } = data;


    const user = await UserModel.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] });

    if (!user) throw new Error('User not registered');

    const correct = await argon2.verify(user.password, password);

    delete user.password;

    if (!correct) throw new Error('Password incorrect');

    const token = this.tokenService.encode({ _id: user.id, verified: true });

    return { user, token };
  }
}
