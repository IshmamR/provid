import React, { memo } from "react";
import { Button } from "antd";
import styled from "styled-components";
import { down } from "styled-breakpoints";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import { ISearchedVideoResponse } from "../../../shared/types/video";
import { numberWithCommas } from "../../utils/numbers";
// import YoutubeOutlined from "@ant-design/icons/YoutubeOutlined";

const Thumbnail = styled.a<{ src: string }>`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 2px;

  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary.main};
  }

  ${down("md")} {
    border: none;
    height: 7rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const VideoBox = styled.div`
  position: relative;
  margin: auto;
  margin-top: 1rem;
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

  ${Thumbnail} {
    opacity: 0.9;
  }

  &:hover {
    ${Thumbnail} {
      opacity: 1;
    }
  }

  ${down("md")} {
    grid-template-columns: 1fr;
    padding: 0;

    ${Thumbnail} {
      opacity: 1;
    }
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

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  info: ISearchedVideoResponse["items"][number];
  onDownloadClick: (vidUrl: string) => void;
}

const VideoItemInfo: React.FC<IProps> = ({
  info,
  onDownloadClick,
  ...rest
}): JSX.Element => {
  return (
    <VideoBox {...rest}>
      <Thumbnail
        href={info.url}
        src={info.bestThumbnail.url}
        title={info.title}
        target="_blank"
        rel="noreferrer"
      />
      <VidInfo>
        <div>
          <VideoTitleBox>
            <VideoTitle>{info.title}</VideoTitle>
          </VideoTitleBox>
          <VideoTexts>
            <ClockCircleOutlined />
            &nbsp;{info.duration}&nbsp;&nbsp;
            <EyeOutlined />
            &nbsp;{numberWithCommas(info.views)}&nbsp;&nbsp;
            <a
              href={info.author.url}
              title={info.author.name}
              target="_blank"
              rel="noreferrer"
            >
              <UserOutlined />
              &nbsp;
              {info.author.name.slice(0, 15)}
            </a>
            &nbsp;&nbsp;
            {/* <a href={info.url} target="_blank" rel="noreferrer">
              <YoutubeOutlined className="video_url" />
            </a> */}
          </VideoTexts>
        </div>
        <DownloadButton
          size={"large"}
          icon={<DownloadOutlined />}
          onClick={() => onDownloadClick(info.url)}
        >
          Download
        </DownloadButton>
      </VidInfo>
    </VideoBox>
  );
};

function areEqual(
  prevProps: Readonly<React.PropsWithChildren<IProps>>,
  nextProps: Readonly<React.PropsWithChildren<IProps>>
): boolean {
  return prevProps.info.url === nextProps.info.url;
}

export default memo(VideoItemInfo, areEqual);
