import React, { useRef, useState } from "react";
import { Button, Input, Modal, Radio } from "antd";
import styled from "styled-components";
import { down } from "styled-breakpoints";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import YoutubeOutlined from "@ant-design/icons/YoutubeOutlined";
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";

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

const VideoBox = styled.div`
  margin: auto;
  margin-top: 2rem;
  width: 700px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11),
    0 4px 4px rgba(0, 0, 0, 0.11), 0 6px 8px rgba(0, 0, 0, 0.11),
    0 8px 16px rgba(0, 0, 0, 0.11);
  max-width: 85vw;
  display: grid;
  grid-template-columns: 2fr 3fr;
  align-items: center;
  column-gap: 0.5rem;

  ${down("md")} {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

const Thumbnail = styled.img`
  max-width: 100%;
  border-radius: 2px;

  ${down("md")} {
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const VideoTitle = styled.p`
  font-size: 1.25rem;
  line-height: 2rem;
  font-weight: 700;
  margin-bottom: 0;

  ${down("md")} {
    font-size: 0.875rem;
    line-height: 1rem;
  }
`;

const VideoTexts = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  margin-bottom: 0;
  font-weight: 500;
  display: inline-flex;
  align-items: center;

  .video_url {
    font-size: 130%;
  }

  ${down("md")} {
    font-size: 0.75rem;
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

const VideoTitleBox = styled.div`
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`;

const VidInfo = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 100%;
  row-gap: 0.5rem;

  ${down("md")} {
    padding: 0.5rem;
    /* row-gap: 0.5rem; */
  }
`;

const DownloadForm = styled.form`
  display: flex;
  flex-flow: column;
`;

// Proud of myself for doing regex without looking up stack-overflow
const regex = /^((https:\/\/)?(youtu\.be\/|(www\.)?youtube\.com\/watch\?v=))/;

interface IVideoInfo {
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
  _filename: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends React.HTMLAttributes<HTMLElement> {}

function App(props: IProps): JSX.Element {
  const [url, setUrl] = useState<string>("");
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<IVideoInfo | undefined>(undefined);
  const [downloadModal, setDownloadModal] = useState<boolean>(false);
  const [downloadQuery, setDownloadQuery] = useState<{
    format: "video" | "audio";
    quality?: "high" | "low";
  }>({
    format: "video",
    quality: undefined,
  });
  // const [hdFormat, setHdFormat] = useState<any>();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const inputRef = useRef<Input>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    if (e?.target.value && e.target.value.trim() !== "") {
      setUrl(e.target.value);
    } else {
      setUrl("");
    }
  };

  React.useEffect(() => {
    inputRef.current?.focus();

    if (navigator.clipboard?.readText) {
      navigator.clipboard.readText().then((clipText) => {
        if (regex.test(clipText)) {
          setUrl(clipText);
        }
      });
    }
  }, []);

  const handleGetInfo = (f: React.FormEvent<HTMLFormElement> | undefined) => {
    f?.preventDefault();
    setInfoLoading(true);

    const valid = regex.test(url);
    if (!valid) {
      setInfoLoading(false);
      return;
    }
    fetch(`/api/video/info?url=${url}`)
      .then((res) => res.json())
      .then((data: any) => {
        setInfo(data);
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
      .finally(() => setInfoLoading(false));
  };

  const handleStartDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadModal(false);
    }, 5000);
  };

  return (
    <>
      <Form onSubmit={handleGetInfo} {...props}>
        <UrlInput
          ref={inputRef}
          value={url}
          onChange={handleChange}
          allowClear
          size="large"
        />
        <SubmitButton
          type="primary"
          htmlType="submit"
          size="large"
          loading={infoLoading}
        >
          Submit
        </SubmitButton>
      </Form>

      <VideoBox style={{ display: info ? "grid" : "none" }}>
        <Thumbnail src={info?.thumbnail} alt={info?.title} />
        <VidInfo>
          <div>
            <VideoTitleBox>
              <VideoTitle>{info?.title}</VideoTitle>
            </VideoTitleBox>
            <VideoTexts>
              <ClockCircleOutlined />
              &nbsp;{info?.duration}&nbsp;&nbsp;
              <EyeOutlined />
              &nbsp;{numberWithCommas(info?.view_count)}&nbsp;&nbsp;
              <UserOutlined />
              &nbsp;{info?.uploader}&nbsp;&nbsp;
              <a href={info?.url} target="_blank" rel="noreferrer">
                <YoutubeOutlined className="video_url" />
              </a>
            </VideoTexts>
          </div>
          <DownloadButton
            size={"large"}
            icon={<DownloadOutlined />}
            onClick={() => setDownloadModal(true)}
          >
            Download
          </DownloadButton>
        </VidInfo>
      </VideoBox>

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
          action="/api/video/download"
          // target="hiddenFrame"
        >
          <input
            name="url"
            value={info?.webpage_url}
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
}

export default App;

function numberWithCommas(x?: number): string | null {
  if (x) return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  else return null;
}
