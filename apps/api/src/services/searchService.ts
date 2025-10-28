import { RoadListResponseDTO } from '@repo/types';

import searchRepository from '../repositories/searchRepository';
import { pilgrimageAverageRate } from '../services/roadService';

class SearchService {
  async searchRoad(userId: number | null, word: string, sortBy: string = 'popular', categoryId?: number): Promise<{ results: RoadListResponseDTO[] }> {
    const rawResults = await searchRepository.searchPilgrimages([word], categoryId, sortBy);
    if (userId) { await searchRepository.saveSearchKeyword(userId, word); }
    const sortedResults = [...rawResults];

    switch (sortBy) {
      case "views":
        sortedResults.sort((a, b) => b.search - a.search);
        break;
      case "participants":
        sortedResults.sort((a, b) => b.participants.length - a.participants.length);
        break;
      case "popular":
      default:
        sortedResults.sort((a, b) => {
          const avgA = pilgrimageAverageRate(a.spots);
          const avgB = pilgrimageAverageRate(b.spots);
          return avgB - avgA;
        });
        break;
    }

    const results = sortedResults.map((p) => ({
      roadId: p.id,
      title: p.title,
      intro: p.intro,
      imageUrl: p.imageUrl ?? null,
      categoryId: p.categoryId,
      participants: p.participants.length,
      native: p.participants[0]?.user.native ?? null,
    }));

    return { results };
  }

  async deleteSearchWord(userId: number, word: string): Promise<void> {
    await searchRepository.deleteSearchKeyword(userId, word);
  }

  async deleteAllSearchWords(userId: number): Promise<void> {
    await searchRepository.deleteAllSearchKeywords(userId);
  }

  async getRecentSearchWords(userId: number): Promise<string[]> {
    const keywordObjects = await searchRepository.getRecentSearchKeywords(userId);
    return keywordObjects.map(k => k.word);
  }
}

export default new SearchService();