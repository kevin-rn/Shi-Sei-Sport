import type { Media, Location } from './payload-types';

export interface AgendaItem {
  id: number;
  slug: string;
  title: string;
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  category: 'vacation' | 'holiday' | 'exam' | 'competition' | 'other';
  startDate: string;
  endDate?: string | null;
  allDay: boolean;
  startTime?: string | null;
  endTime?: string | null;
  location?: (number | Location) | null;
  customLocation?: string | null;
  coverImage?: (number | Media) | null;
  status: 'draft' | 'published' | 'cancelled';
  registrationRequired: boolean;
  registrationDeadline?: string | null;
  maxParticipants?: number | null;
  externalUrl?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface Grade {
  id: number;
  gradeType: 'kyu' | 'dan';
  // Kyu-specific fields
  beltLevel?: 'yellow-5kyu' | 'orange-4kyu' | 'green-3kyu' | 'blue-2kyu' | 'brown-1kyu';
  kyuRank?: number;
  examDocument?: (number | null) | Media;
  supplementaryDocuments?: {
    document?: (number | null) | Media;
    description?: string | null;
    id?: string | null;
  }[] | null;
  minimumAge?: string | null;
  // Dan-specific fields
  externalUrl?: string | null;
  externalUrlText?: string | null;
  // Common fields
  title: string;
  description: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  order: number;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  createdAt: string;
}

export type KyuGrade = Grade;

// Price interface (unified plan and settings)
export interface Price {
  id: number;
  priceType: 'plan' | 'settings';
  // Plan-specific fields
  planName?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  features?: {
    feature: string;
    id?: string | null;
  }[];
  popular?: boolean;
  // Settings-specific fields
  registrationFee?: string;
  ooievaarspasText?: string | null;
  // Common fields
  displayOrder: number;
  updatedAt: string;
  createdAt: string;
}

export type PricingSettings = Price;

export interface ContactInfo {
  id: number;
  postalAddress: string;
  phones: {
    number: string;
    id?: string | null;
  }[];
  emails: {
    email: string;
    id?: string | null;
  }[];
  globalType: string;
  updatedAt: string;
  createdAt: string;
}

export interface VCPInfo {
  id: number;
  vcpName: string;
  vcpEmail: string;
  vcpSince?: string | null;
  introduction: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  whatDoesVcpDo: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  forWhom: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  whyContact: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  vcpBio?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  preventivePolicy?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  crossingBehavior?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  vcpTasks?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  globalType: string;
  updatedAt: string;
  createdAt: string;
}

export type DanGradesInfo = Grade;

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface VideoEmbed {
  id: number;
  title: string;
  embedUrl: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: number;
  title: string;
  description?: string;
  photos: (number | Media)[];
  videos?: { id: string; url: string }[];
  date: string;
  status: 'draft' | 'published';
  isHeroCarousel?: boolean;
  isBanner?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MediaLike = {
  url?: string | null;
  sizes?: Record<string, { url?: string | null }>;
};
