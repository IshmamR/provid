import dynamic from "next/dynamic";
import React, { useRef, useState, useEffect } from "react";
import { Button, Input } from "antd";
import styled from "styled-components";
import { down } from "styled-breakpoints";
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { DOWNLOAD_VIDEO } from "../../api/endpoints";
import {
  ISearchedVideoResponse,
  IVideoInfo,
} from "../../../shared/types/video";
import {
  continueVideoList,
  getVideoInfoApi,
  searchVideoByText,
  TVideoApiError,
} from "../../api/videoApi";
import { showNotification } from "../../Contexts/notifications";
import VideoInfoBox from "./VideoInfoBox";
import VideoItemSkeleton from "./VideoItemSkeleton";
import { BoxLayout } from "../layouts/BoxLayout";

/**
 * Dynamic import for less first-load-js
 */
const Modal = dynamic(() => import("antd/lib/modal/index"));
const Radio = dynamic(() => import("antd/lib/radio/index"));
const RadioGroup = dynamic(() => import("antd/lib/radio/group"));
const VideoItemInfo = dynamic(() => import("./VideoItemInfoBox"));

const UrlInput = styled(Input)`
  padding: 0.75rem;
  border-radius: 4px 0 0 4px;
  border-color: ${({ theme }) => theme.colors.primary.main};
  ${down("md")} {
    font-size: 12px;
    padding: 0.375rem;
  }
`;

const SubmitButton = styled(Button)`
  height: 100%;
  border-radius: 0 4px 4px 0;
`;

const Form = styled.form`
  width: 100%;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 5fr 1fr; ;
`;

const Writing1 = styled.p`
  margin: 0;
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  text-align: center;

  ${down("md")} {
    font-size: 0.875rem;
    line-height: 1.125rem;
    font-weight: 400;
  }
`;

const DownloadButton = styled(Button)`
  color: ${({ theme }) => theme.colors.black};
  font-size: 120%;
  font-weight: 500;

  ${down("sm")} {
    font-size: 80%;
    height: 80%;
  }
`;

const DownloadForm = styled.form`
  display: flex;
  flex-flow: column;
`;

const LoadMoreButton = styled(Button)`
  width: 100%;
  margin-top: 1.5rem;
`;

// Proud of myself for doing regex without looking up stack-overflow
const regex = /^((https:\/\/)(youtu\.be\/|(www\.)?youtube\.com\/watch\?v=))/;

const initialInfo = {
  hasInfo: false,
  id: "",
  title: "",
  thumbnail: "",
  descriptions: "",
  upload_date: "",
  uploader: "",
  duration: "",
  view_count: 0,
  url: "",
  webpage_url: "",
  fulltitle: "",
  formats: [],
  _filename: "",
  categories: [],
  tags: [],
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends React.HTMLAttributes<HTMLElement> {}

const YTDownloadBlock: React.FC<IProps> = (props): JSX.Element => {
  const [input, setInput] = useState<string>("");
  const [info, setInfo] = useState<IVideoInfo>(initialInfo);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [downloadModal, setDownloadModal] = useState<string | null>(null);
  const [downloadQuery, setDownloadQuery] = useState<{
    format: "video" | "audio";
    iTag: number;
  }>({ format: "video", iTag: 18 });
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<boolean>(true);
  const [videoListData, setVideoListData] =
    useState<ISearchedVideoResponse | null>(null);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);

  const inputRef = useRef<Input>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    const value = e?.target.value;
    if (value && value.trim() !== "") {
      setInput(value);
      // check for search video or submit link
      if (regex.test(value)) {
        setSearchMode(false);
      } else {
        setSearchMode(true);
      }
    } else {
      setInput("");
      setSearchMode(true);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();

    if (navigator.clipboard?.readText) {
      navigator.clipboard.readText().then((clipText) => {
        if (regex.test(clipText)) {
          setInput(clipText);
        }
      });
    }
  }, []);

  /**
   * @on_submit_event_handler
   * updates video info based on search or submit
   */
  const handleGetInfo = (f: React.FormEvent<HTMLFormElement> | undefined) => {
    f?.preventDefault();
    setInfoLoading(true);

    if (input.trim() === "") {
      showNotification("error", "Input field is empty");
      setInfoLoading(false);
      return;
    }

    /**
     * @if_text_search_mode
     */
    if (searchMode) {
      searchVideoByText(input)
        .then((res) => {
          setVideoListData(res.data);
        })
        .catch((err: TVideoApiError) => {
          showNotification(
            "error",
            err.response?.data.message || "Could not fetch video list"
          );
        })
        .finally(() => setInfoLoading(false));
      return;
    }

    /**
     * @else_if_video_link_submission
     */
    const valid = regex.test(input);
    if (!valid) {
      setInfoLoading(false);
      showNotification(
        "error",
        "URL not valid",
        "Provide a valid YouTube video url"
      );
      return;
    }

    // show a random loading without calling an api :p
    if (info.webpage_url === input.trim()) {
      const random = Math.floor(Math.random() * 10000) + 1000;
      setTimeout(() => {
        setInfoLoading(false);
      }, random);
      return;
    }

    getVideoInfoApi(input.trim())
      .then((res) => {
        const hdFormat = res.data.formats.find(
          (f: any) =>
            ["720p", "1080p"].includes(f.format_note) && f.asr !== null
        );
        if (hdFormat) {
          setDownloadQuery((prev) => ({ ...prev, iTag: hdFormat.format_id }));
        }
        setInfo({ ...res.data, hasInfo: true });
      })
      .catch((err: TVideoApiError) => {
        showNotification(
          "error",
          err.response?.data.message || "Could not fetch video info"
        );
      })
      .finally(() => setInfoLoading(false));
  };

  const handleStartDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadModal(null);
    }, 6000);
  };

  const handleVideoBoxClose = (vidId: string) => {
    setInfo((prev) => {
      if (prev.id === vidId) return initialInfo;
      return prev;
    });
    setInput((prev) => {
      if (prev === info.webpage_url) return "";
      return prev;
    });
  };

  const handleDownload = (vidUrl: string) => {
    setDownloadModal(vidUrl);
  };

  const handleLoadMoreClick = () => {
    if (!videoListData) return;
    setMoreLoading(true);
    continueVideoList(videoListData.continuation)
      .then((res) => {
        setVideoListData((prev) => {
          if (prev)
            return {
              ...prev,
              items: [...prev.items, ...res.data.items],
              continuation: res.data.continuation,
            };
          return prev;
        });
      })
      .catch((err: TVideoApiError) => {
        showNotification(
          "error",
          err.response?.data.message || "Could not fetch video list"
        );
      })
      .finally(() => setMoreLoading(false));
  };

  return (
    <>
      <BoxLayout>
        <Form onSubmit={handleGetInfo} {...props}>
          <UrlInput
            ref={inputRef}
            value={input}
            onChange={handleChange}
            allowClear
            name="provide-youtube-url"
            size="large"
            placeholder="Paste video url e.g.: https://www.youtube.com/watch?v=..."
            required
          />
          <SubmitButton
            type="primary"
            htmlType="submit"
            size="large"
            loading={infoLoading}
          >
            {searchMode ? "Search" : "Submit"}
          </SubmitButton>
        </Form>
        <Writing1>
          <strong>To search</strong>: Type in what you want to search from
          YouTube To get.
          <br />
          <strong>To get download link</strong>: Submit your chosen youtube
          video url and click&nbsp;
          <code>Download</code>!
        </Writing1>

        <VideoInfoBox
          info={info}
          key={info.webpage_url}
          onDownloadClick={handleDownload}
          onCloseVideoBox={handleVideoBoxClose}
        />

        <Writing1></Writing1>
        {videoListData
          ? videoListData.items.map((vid) => (
              <VideoItemInfo
                key={vid.url}
                info={vid}
                onDownloadClick={handleDownload}
              />
            ))
          : null}

        <LoadMoreButton
          style={{
            display: moreLoading
              ? "none"
              : videoListData?.items.length
              ? "block"
              : "none",
          }}
          type="primary"
          size="large"
          onClick={handleLoadMoreClick}
        >
          Load More
        </LoadMoreButton>
        <VideoItemSkeleton
          style={{ display: videoListData && moreLoading ? "grid" : "none" }}
        />

        {/* Download Modal */}
        <Modal
          visible={!!downloadModal}
          onCancel={() => setDownloadModal(null)}
          closeIcon={<CloseCircleOutlined />}
          footer={null}
        >
          <iframe
            name="hiddenFrame"
            style={{
              position: "absolute",
              top: "-1px",
              left: "-1px",
              width: "1px",
              height: "1px",
            }}
          ></iframe>
          <DownloadForm
            method="POST"
            action={DOWNLOAD_VIDEO()}
            target="hiddenFrame"
          >
            <input
              name="url"
              value={downloadModal ?? ""}
              style={{ display: "none" }}
              readOnly
            />
            <h3>Format</h3>
            <RadioGroup
              name="format"
              value={downloadQuery.format}
              onChange={(e) =>
                setDownloadQuery((prev) => ({
                  ...prev,
                  format: e.target.value,
                }))
              }
            >
              <Radio value={"video"}>
                <p>Video (.mp4)</p>
              </Radio>
              <Radio value={"audio"}>
                <p>Audio (.mp3)</p>
              </Radio>
            </RadioGroup>
            <h3>Quality</h3>
            <input
              style={{ display: "none" }}
              name="iTag"
              value={downloadQuery.iTag}
              readOnly
            />
            <p>*functionality coming soon</p>
            <DownloadButton
              size="large"
              icon={<DownloadOutlined />}
              htmlType="submit"
              onClick={handleStartDownload}
              loading={isDownloading}
            >
              Start Download
            </DownloadButton>
          </DownloadForm>
        </Modal>
      </BoxLayout>
    </>
  );
};

export default YTDownloadBlock;
