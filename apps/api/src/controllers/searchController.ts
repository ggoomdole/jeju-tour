import { NextFunction, Request, Response } from 'express';

import { successHandler } from '../middlewares/responseHandler';
import searchService from '../services/searchService';
import { NotFoundError } from '../utils/customError';

class SearchController {
  async searchRoad(req: Request, res: Response, next: NextFunction) {
    try{
        const userId = req.user?.userId ?? null;

        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

        const word = req.query.word;
        if (!word || typeof word !== 'string') { throw new NotFoundError('검색어는 필수입니다.'); }

        const sortBy = (req.query.sortBy as string) || 'popular';
        if (!sortBy) throw new NotFoundError('정렬 기준이 존재하지 않습니다.');

        const result = await searchService.searchRoad(userId, word, sortBy, categoryId);
        return successHandler(res, '순례길 검색 성공', result);
    } catch (error) {
        next(error);
    }
  }

  async deleteSearchWord(req: Request, res: Response, next: NextFunction) {
    try{
        const { word } = req.body;
        const userId = req.user.userId;

        if (!word || typeof word !== 'string') { throw new NotFoundError('검색어는 필수입니다.'); }

        await searchService.deleteSearchWord(userId, word);
        return successHandler(res, '검색어 삭제 완료', word);
    } catch (error) {
        next(error);
    }
  }

  async deleteSearchAllWord(req: Request, res: Response, next: NextFunction) {
    try{
        const userId = req.user.userId;
        await searchService.deleteAllSearchWords(userId);
        return successHandler(res, '전체 검색어 삭제 완료');
    } catch (error) {
        next(error);
    }
  }

  async getRecentSearchWords(req: Request, res: Response, next: NextFunction) {
    try{
        const userId = req.user.userId;
        const recentList = await searchService.getRecentSearchWords(userId);
        return successHandler(res, '최근 검색어 조회 완료', recentList);
    } catch (error) {
        next(error);
    }
  }
};

export default new SearchController();