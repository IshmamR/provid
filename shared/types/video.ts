export interface IVideoInfo {
  hasInfo?: boolean;
  id: string;
  title: string;
  thumbnail: string;
  descriptions: string;
  upload_date: string;
  uploader: string;
  duration: string;
  view_count: number;
  url: string;
  webpage_url: string;
  fulltitle: string;
  formats: any[];
  _filename: string;
  categories: string[];
  tags: string[];
}

export interface ISearchedVideoResponse {
  originalQuery: string;
  correctedQuery: string;
  results: number;
  activeFilters: {
    name: string; // 'Relevance',
    active: boolean;
    url: string | null;
    description: string; // "Sort by relevance";
  }[];

  items: {
    type: "video" | "mix" | "channel" | "playlist";
    title: string;
    id: string; //"AOeY-nDp7hI"
    url: string; // "https://www.youtube.com/watch?v=AOeY-nDp7hI";
    bestThumbnail: {
      url: string;
      width: number;
      height: number;
    };
    thumbnails: {
      url: string;
      width: number;
      height: number;
    }[];
    isUpcoming: boolean;
    upcoming: any;
    isLive: boolean;
    badges: string[];
    author: {
      name: string;
      channelID: string; // "UC_aEa8K-EOJ3D6gOs7HcyNg";
      url: string; // "https://www.youtube.com/user/NoCopyrightSounds";
      bestAvatar: {
        url: string;
        width: number;
        height: number;
      };
      avatars: {
        url: string;
        width: number;
        height: number;
      }[];
      ownerBadges: string[];
      verified: boolean;
    };
    description: string;
    views: number;
    duration: string; // "3:47";
    uploadedAt: string;
  }[];

  continuation: (
    | string
    | {
        client: {
          utcOffsetMinutes?: number;
          gl?: string;
          hl?: string; // "en",
          clientName?: string; // "WEB",
          clientVersion: string; // "2.20220208.00.00"
        };
        user?: any;
        request?: any;
      }
    | {
        limit?: any;
        safeSearch: boolean;
        pages: number;
        requestOptions: any;
        query: {
          gl: string; // "US";
          hl: string; // "en";
          search_query: string;
        };
        search: string;
      }
  )[];

  refinements?: {
    q: string;
    url: string;
    bestThumbnail: {
      url: string;
      width: number;
      height: number;
    };
    thumbnails: {
      url: string;
      width: number;
      height: number;
    }[];
  }[];
}
