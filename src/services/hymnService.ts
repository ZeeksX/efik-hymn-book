import type { Hymn } from '../types/hymn';
import type { Category } from '../types/category';
import { HYMNS } from '../data/hymns';
import { CATEGORIES } from '../data/categories';

export const hymnService = {
  getAllHymns(): Hymn[] {
    return [...HYMNS].sort((a, b) => a.number - b.number);
  },

  getHymnById(id: string): Hymn | undefined {
    return HYMNS.find((h) => h.id === id);
  },

  getHymnByNumber(number: number): Hymn | undefined {
    return HYMNS.find((h) => h.number === number);
  },

  getHymnsByCategory(categorySlugOrName: string): Hymn[] {
    const targetCategory = CATEGORIES.find(
      (c) => c.slug.toLowerCase() === categorySlugOrName.toLowerCase() ||
             c.name.toLowerCase() === categorySlugOrName.toLowerCase()
    );

    const categoryNameToMatch = targetCategory ? targetCategory.name : categorySlugOrName;

    return HYMNS.filter((h) =>
      h.category.toLowerCase().includes(categoryNameToMatch.toLowerCase()) ||
      categoryNameToMatch.toLowerCase().includes(h.category.toLowerCase())
    ).sort((a, b) => a.number - b.number);
  },

  getHymnsByIds(ids: string[]): Hymn[] {
    const idMap = new Map(HYMNS.map((h) => [h.id, h]));
    return ids.map((id) => idMap.get(id)).filter((h): h is Hymn => Boolean(h));
  },

  getFeaturedHymns(): Hymn[] {
    const featuredNumbers = [1, 2, 7, 23, 42, 96, 128, 185];
    return HYMNS.filter((h) => featuredNumbers.includes(h.number));
  },

  getAdjacentHymns(currentNumber: number): { prev: Hymn | null; next: Hymn | null } {
    const sorted = this.getAllHymns();
    const currentIndex = sorted.findIndex((h) => h.number === currentNumber);

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
    const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

    return { prev, next };
  },

  getCategories(): (Category & { count: number })[] {
    return CATEGORIES.map((cat) => {
      const count = HYMNS.filter((h) =>
        h.category.toLowerCase().includes(cat.name.toLowerCase()) ||
        cat.name.toLowerCase().includes(h.category.toLowerCase())
      ).length;

      return {
        ...cat,
        count,
      };
    });
  },

  getCategoryBySlug(slug: string): (Category & { count: number }) | undefined {
    const categories = this.getCategories();
    return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  },

  getAlphabeticalIndex(): { letter: string; hymns: Hymn[] }[] {
    const sorted = [...HYMNS].sort((a, b) => a.title.localeCompare(b.title));
    const map = new Map<string, Hymn[]>();

    sorted.forEach((hymn) => {
      const firstChar = hymn.title.trim().charAt(0).toUpperCase();
      const current = map.get(firstChar) || [];
      current.push(hymn);
      map.set(firstChar, current);
    });

    return Array.from(map.entries())
      .map(([letter, hymns]) => ({ letter, hymns }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  },
};
