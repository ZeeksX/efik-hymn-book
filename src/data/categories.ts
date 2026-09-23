import type { Category } from '../types/category';

export const CATEGORIES: Category[] = [
  {
    id: 'praise',
    slug: 'praise',
    name: 'Praise',
    description: 'Songs of exaltation, thanksgiving, and glory to Almighty God.',
    hymnCount: 58,
    iconName: 'Users',
    color: 'emerald',
  },
  {
    id: 'worship',
    slug: 'worship',
    name: 'Worship',
    description: 'Reverent devotion, deep homage, and honoring the Majesty of God.',
    hymnCount: 42,
    iconName: 'Music',
    color: 'sky',
  },
  {
    id: 'prayer',
    slug: 'prayer',
    name: 'Prayer',
    description: 'Petitions, intercession, calling upon God in humility and trust.',
    hymnCount: 36,
    iconName: 'HandHeart',
    color: 'purple',
  },
  {
    id: 'thanksgiving',
    slug: 'thanksgiving',
    name: 'Thanksgiving',
    description: 'Offering gratitude for God’s unfailing mercies and providence.',
    hymnCount: 28,
    iconName: 'Flame',
    color: 'amber',
  },
  {
    id: 'holy-spirit',
    slug: 'holy-spirit',
    name: 'Holy Spirit',
    description: 'Invoking the comfort, guidance, power, and presence of the Spirit.',
    hymnCount: 24,
    iconName: 'Wind',
    color: 'cyan',
  },
  {
    id: 'salvation',
    slug: 'salvation',
    name: 'Salvation',
    description: 'Redemption through Jesus Christ, repentance, and free forgiveness.',
    hymnCount: 20,
    iconName: 'Cross',
    color: 'teal',
  },
  {
    id: 'communion',
    slug: 'communion',
    name: 'Communion',
    description: 'Remembering the body and blood of our Savior Jesus Christ.',
    hymnCount: 18,
    iconName: 'Wine',
    color: 'rose',
  },
  {
    id: 'christmas',
    slug: 'christmas',
    name: 'Christmas',
    description: 'Celebrating the birth of Emmanuel and the light of the world.',
    hymnCount: 16,
    iconName: 'Star',
    color: 'emerald',
  },
  {
    id: 'easter',
    slug: 'easter',
    name: 'Easter',
    description: 'Christ is risen! Victory over death, grave, and sin.',
    hymnCount: 14,
    iconName: 'Sunrise',
    color: 'yellow',
  },
  {
    id: 'funeral',
    slug: 'funeral',
    name: 'Funeral',
    description: 'Resting in the Lord, comfort in bereavement, and heaven’s glory.',
    hymnCount: 12,
    iconName: 'Shield',
    color: 'slate',
  },
  {
    id: 'marriage',
    slug: 'marriage',
    name: 'Marriage',
    description: 'Holy matrimony, blessings upon homes, union, and covenant love.',
    hymnCount: 10,
    iconName: 'Heart',
    color: 'pink',
  },
  {
    id: 'children',
    slug: 'children',
    name: 'Children',
    description: 'Dedication of little ones, youth guidance, and simple faith.',
    hymnCount: 10,
    iconName: 'Sparkles',
    color: 'indigo',
  },
  {
    id: 'morning',
    slug: 'morning',
    name: 'Morning',
    description: 'Starting the new dawn in thanksgiving, commitment, and divine grace.',
    hymnCount: 10,
    iconName: 'SunMedium',
    color: 'amber',
  },
  {
    id: 'evening',
    slug: 'evening',
    name: 'Evening',
    description: 'Peaceful rest, closing the day under the shadow of the Almighty.',
    hymnCount: 10,
    iconName: 'Moon',
    color: 'violet',
  },
];

/**
 * Returns badge CSS classes for category tags matching the design mockup
 */
export function getCategoryBadgeClasses(categoryName: string): string {
  const norm = categoryName.toLowerCase();
  if (norm.includes('praise')) {
    return 'bg-[#EBF7EE] text-[#1E7238] border border-[#CDEED5] dark:bg-[#1A3323] dark:text-[#6BD88E] dark:border-[#285738]';
  }
  if (norm.includes('worship')) {
    return 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] dark:bg-[#1E293B] dark:text-[#93C5FD] dark:border-[#2D4569]';
  }
  if (norm.includes('prayer')) {
    return 'bg-[#F5F3FF] text-[#6D28D9] border border-[#EDE9FE] dark:bg-[#2A223E] dark:text-[#C4B5FD] dark:border-[#47366B]';
  }
  if (norm.includes('thanksgiving')) {
    return 'bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7] dark:bg-[#332617] dark:text-[#FCD34D] dark:border-[#5E4424]';
  }
  if (norm.includes('holy spirit')) {
    return 'bg-[#ECFEFF] text-[#0E7490] border border-[#CFFAFE] dark:bg-[#152E36] dark:text-[#67E8F9] dark:border-[#204A56]';
  }
  if (norm.includes('salvation')) {
    return 'bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] dark:bg-[#153430] dark:text-[#5EEAD4] dark:border-[#1F534D]';
  }
  if (norm.includes('communion')) {
    return 'bg-[#FFF1F2] text-[#BE123C] border border-[#FFE4E6] dark:bg-[#34161C] dark:text-[#FDA4AF] dark:border-[#58242F]';
  }
  if (norm.includes('christmas') || norm.includes('easter')) {
    return 'bg-[#FEFCE8] text-[#A16207] border border-[#FEF9C3] dark:bg-[#302B15] dark:text-[#FDE047] dark:border-[#544B22]';
  }
  return 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] dark:bg-[#262626] dark:text-[#D1D5DB] dark:border-[#404040]';
}
