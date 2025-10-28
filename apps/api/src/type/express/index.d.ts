import { User } from '@prisma/client';

import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      user: {
        userId: number;
      };
    }
  }
}

export {};