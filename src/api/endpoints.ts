export const DOWNLOAD_VIDEO = () => "/api/video/download";
export const GET_VIDEO_INFO = (url: string) => `/api/video/info?url=${url}`;
export const SEARCH_VIDEOS = (search: string) =>
  `/api/video/search?search=${search}`;
export const CONTINUE_VIDEO_LIST = () => `/api/video/continue`;
