/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable, inject } from 'inversify';
import { TokenService } from './token';
// import argon2 from 'argon2';

interface RegistrationInput {
  firstName: User['firstName'];
  lastName: User['lastName'];
  phoneNumber: User['phoneNumber'];
  email: User['email'];
}

interface AuthResult {
  user: User;
  token: string;
}

interface LoginInput {
  identifier: User['username'] | User['phoneNumber'] | User['email'] | string;
}

@injectable()
export class AuthService {

  @inject(TokenService)
  private tokenService: TokenService;

  async register(data: RegistrationInput, options: { password: string; verify?: boolean }): Promise<AuthResult> {
    const { password } = options;

    const { email, phoneNumber } = data;

    const existingUser = undefined; // check if user exist

    if (existingUser) throw new Error('User already registered');

    // const hash = await argon2.hash(password);

    const user: User = { phoneNumber, email };

    const token = this.tokenService.encode({ _id: user.id, verified: true });

    return { user: user, token };
  }

  async login(
    data: LoginInput,
    options: {
      password: string;
      verify?: boolean;
    },
  ): Promise<AuthResult> {
    // const { identifier } = data;


    const user: User = {}

    if (!user) throw new Error('User not registered');

    // const { password } = options;

    // const correct = await argon2.verify(user.password, password);

    // if (!correct) throw new Error('Password incorrect');

    const token = this.tokenService.encode({ _id: user.id, verified: true });

    return { user, token };
  }

  async verifyLogin(data: { token: string; verificationCode: string }): Promise<AuthResult> {
    const { token, verificationCode } = data;

    const decodedToken: {
      data: LoginInput;
      code: string;
      password: string;
    } = await this.tokenService.decode(token);

    const { data: loginInput, code, password } = decodedToken;

    if (code !== verificationCode) throw new Error('Verification code is incorrect');

    const result = await this.login(loginInput, { password });

    return result;
  }
}
