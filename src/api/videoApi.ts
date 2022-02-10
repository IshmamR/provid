import { AxiosResponse, AxiosError } from "axios";
import {
  ISearchedVideoResponse,
  IVideoContinuationResponse,
  IVideoInfo,
} from "../../shared/types/video";
import { publicRequest } from "./apiRequest";
import {
  CONTINUE_VIDEO_LIST,
  GET_VIDEO_INFO,
  SEARCH_VIDEOS,
} from "./endpoints";

export type TVideoApiError = AxiosError<{
  message: string;
}>;

export const getVideoInfoApi = (url: string) => {
  return new Promise<AxiosResponse<IVideoInfo>>((resolve, reject) => {
    publicRequest
      .get(GET_VIDEO_INFO(url))
      .then((resp) => resolve(resp))
      .catch((err) => reject(err));
  });
};

export const searchVideoByText = (search: string) => {
  return new Promise<AxiosResponse<ISearchedVideoResponse>>(
    (resolve, reject) => {
      publicRequest
        .get(SEARCH_VIDEOS(search))
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    }
  );
};

export const continueVideoList = (
  continuation: ISearchedVideoResponse["continuation"]
) => {
  return new Promise<AxiosResponse<IVideoContinuationResponse>>(
    (resolve, reject) => {
      publicRequest
        .post(CONTINUE_VIDEO_LIST(), { continuation: continuation })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    }
  );
};
