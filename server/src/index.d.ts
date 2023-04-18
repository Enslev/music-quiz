import { UserDocument } from './mongoose/User';

declare global {
    namespace Express {
      interface Request {
        user: UserDocument;
      }
    }
  }
