import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Radio } from "antd";
import styled from "styled-components";
import { down } from "styled-breakpoints";
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { DOWNLOAD_VIDEO } from "../../api/endpoints";
import { IVideoInfo } from "../../../shared/types/video";
import { getVideoInfoApi, TVideoApiError } from "../../api/videoApi";
import { showNotification } from "../../Contexts/notifications";
import VideoInfoBox from "./VideoInfoBox";

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
  width: 700px;
  max-width: 85vw;
  margin: auto;
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
  const [downloadModal, setDownloadModal] = useState<boolean>(false);
  const [downloadQuery, setDownloadQuery] = useState<{
    format: "video" | "audio";
    iTag: number;
  }>({ format: "video", iTag: 18 });
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  const inputRef = useRef<Input>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    const value = e?.target.value;
    if (value && value.trim() !== "") {
      setInput(value);
    } else {
      setInput("");
    }

    // check for search video or submit link
    if (value && value.length >= 8) {
      if (!/https:\/\//gi.test(value) && !searchMode) {
        setSearchMode(true);
      } else if (/https:\/\//gi.test(value)) {
        setSearchMode(false);
      }
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

    /**
     * @if_text_search_mode
     */
    if (searchMode) {
      setInfoLoading(false);
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
      setDownloadModal(false);
    }, 6000);
  };

  const handleVideoBoxClose = (vidId: string) => {
    if (info.id === vidId) {
      setInfo(initialInfo);
      setInput("");
    }
  };

  return (
    <>
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
        Submit your chosen youtube video url and click <code>Download</code>!
      </Writing1>

      <VideoInfoBox
        info={info}
        key={info.id}
        onDownloadClick={() => setDownloadModal(true)}
        onCloseVideoBox={handleVideoBoxClose}
      />

      {/* Download Modal */}
      <Modal
        visible={downloadModal}
        onCancel={() => setDownloadModal(false)}
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
            value={info.webpage_url}
            style={{ display: "none" }}
            readOnly
          />
          <h3>Format</h3>
          <Radio.Group
            name="format"
            value={downloadQuery.format}
            onChange={(e) =>
              setDownloadQuery((prev) => ({ ...prev, format: e.target.value }))
            }
          >
            <Radio value={"video"}>
              <p>Video (.mp4)</p>
            </Radio>
            <Radio value={"audio"}>
              <p>Audio (.mp3)</p>
            </Radio>
          </Radio.Group>
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
    </>
  );
};

export default YTDownloadBlock;
