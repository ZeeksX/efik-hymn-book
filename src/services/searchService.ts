import type { Hymn } from '../types/hymn';
import { HYMNS } from '../data/hymns';
import { normalizeEfikText } from '../utils/formatters';

export interface SearchMatch {
  hymn: Hymn;
  score: number;
  matchField: 'number' | 'exact-title' | 'title-prefix' | 'title' | 'lyrics' | 'tag' | 'category';
  matchedSnippet?: string;
}

export const searchService = {
  search(rawQuery: string): SearchMatch[] {
    const query = rawQuery.trim();
    if (!query) return [];

    const normQuery = normalizeEfikText(query);
    const parsedNumber = parseInt(query, 10);
    const isNumericQuery = !isNaN(parsedNumber) && String(parsedNumber) === query.trim();

    const results: SearchMatch[] = [];

    for (const hymn of HYMNS) {
      let score = 0;
      let matchField: SearchMatch['matchField'] | null = null;
      let matchedSnippet: string | undefined = undefined;

      // 1. Exact Hymn Number Match (Highest Priority)
      if (isNumericQuery && hymn.number === parsedNumber) {
        score = 1000;
        matchField = 'number';
        matchedSnippet = `Hymn #${hymn.number}`;
      } else if (String(hymn.number).startsWith(query)) {
        // Hymn number prefix
        score = 700;
        matchField = 'number';
        matchedSnippet = `Hymn #${hymn.number}`;
      } else {
        const normTitle = normalizeEfikText(hymn.title);
        const normAltTitle = hymn.alternateTitle ? normalizeEfikText(hymn.alternateTitle) : '';

        // 2. Exact Title
        if (normTitle === normQuery || normAltTitle === normQuery) {
          score = 500;
          matchField = 'exact-title';
        }
        // 3. Title Prefix
        else if (normTitle.startsWith(normQuery) || normAltTitle.startsWith(normQuery)) {
          score = 400;
          matchField = 'title-prefix';
        }
        // 4. Title Contains
        else if (normTitle.includes(normQuery) || normAltTitle.includes(normQuery)) {
          score = 300;
          matchField = 'title';
        }
        // 5. Lyrics match
        else {
          let lyricMatch = false;
          for (const verse of hymn.verses) {
            for (const line of verse.lines) {
              const normLine = normalizeEfikText(line);
              if (normLine.includes(normQuery)) {
                score = 200;
                matchField = 'lyrics';
                matchedSnippet = `v${verse.number}: “...${line.trim()}...”`;
                lyricMatch = true;
                break;
              }
            }
            if (lyricMatch) break;
          }

          if (!lyricMatch && hymn.chorus) {
            for (const line of hymn.chorus) {
              const normLine = normalizeEfikText(line);
              if (normLine.includes(normQuery)) {
                score = 180;
                matchField = 'lyrics';
                matchedSnippet = `Chorus: “...${line.trim()}...”`;
                lyricMatch = true;
                break;
              }
            }
          }

          if (!lyricMatch) {
            const normCategory = normalizeEfikText(hymn.category);
            const tagMatch = hymn.tags?.some((t) => normalizeEfikText(t).includes(normQuery));

            if (normCategory.includes(normQuery)) {
              score = 100;
              matchField = 'category';
              matchedSnippet = hymn.category;
            } else if (tagMatch) {
              score = 80;
              matchField = 'tag';
              matchedSnippet = hymn.tags?.find((t) => normalizeEfikText(t).includes(normQuery));
            }
          }
        }
      }

      if (score > 0 && matchField) {
        results.push({
          hymn,
          score,
          matchField,
          matchedSnippet,
        });
      }
    }

    return results.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.hymn.number - b.hymn.number;
    });
  },
};
