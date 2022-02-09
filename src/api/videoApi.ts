import { AxiosResponse, AxiosError } from "axios";
import { IVideoInfo } from "../../shared/types/video";
import { publicRequest } from "./apiRequest";
import { GET_VIDEO_INFO } from "./endpoints";

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
