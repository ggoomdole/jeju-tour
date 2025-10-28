import { Router } from 'express';
import { Request, Response } from 'express';

import authController from '../controllers/authController';
import authenticate from '../middlewares/authenticate';

const router = Router();

router.post('/kakao', authController.kakaoLogin);
router.post('/kakao/unlink', authController.kakaoUnlink);

router.get('/kakao/callback', (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send('인가코드가 없습니다.');
    }
  
    res.redirect(`${process.env.KAKAO_REDIRECT_URI}?code=${code}`);
});

export default router;