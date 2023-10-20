import { Container } from 'inversify';
import { AuthMiddleware, Auth2Middleware } from './middlewares/auth';
import { AuthService } from '../services/auth';
import { TokenService } from '../services/token';
import { UserService } from '../services/user';
import { ArticleService } from '../services/article';
import { CategoryService } from '../services/category';
import { UploadMiddleware } from './middlewares/upload';

export function getContainer(): Container {
  const container = new Container({ skipBaseClassChecks: true });

  container.bind<AuthMiddleware>(AuthMiddleware).to(AuthMiddleware);
  container.bind<Auth2Middleware>(Auth2Middleware).to(Auth2Middleware);
  container.bind<AuthService>(AuthService).to(AuthService);
  container.bind<TokenService>(TokenService).to(TokenService)
  container.bind<UserService>(UserService).to(UserService);
  container.bind<ArticleService>(ArticleService).to(ArticleService);
  container.bind<CategoryService>(CategoryService).to(CategoryService);
  container.bind<UploadMiddleware>(UploadMiddleware).to(UploadMiddleware);
  
  return container;
}
