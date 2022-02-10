import React from "react";
import styled, { keyframes } from "styled-components";
import { down } from "styled-breakpoints";

const VideoBox = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  align-items: center;
  column-gap: 0.5rem;
  position: relative;
  margin-top: 1rem;
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11),
    0 4px 4px rgba(0, 0, 0, 0.11), 0 6px 8px rgba(0, 0, 0, 0.11),
    0 8px 16px rgba(0, 0, 0, 0.11);
  overflow: hidden;

  ${down("md")} {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

const skeletonGradient = keyframes`
  0%, 30% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

const LinearGradientBox = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  left: -100%;
  top: 0;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0)
  );
  z-index: 10;
  animation: 2s ${skeletonGradient} ease-out infinite;
  animation-delay: 1s;
`;

const Thumbnail = styled.div`
  max-width: 100%;
  height: 7.5rem;
  border-radius: 2px;
  background-color: #d3d3d3;

  ${down("md")} {
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
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

const VidTitle = styled.div`
  height: 1.5rem;
  width: 100%;
  background-color: #d3d3d3;
  margin-bottom: 4px;
`;
const VidDesc = styled(VidTitle)`
  height: 0.5rem;
  margin-top: 4px;
`;
const VidButton = styled(VidTitle)`
  margin: 0;
  height: 2.5rem;
`;

const VideoItemSkeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
): JSX.Element => {
  return (
    <VideoBox {...props}>
      <LinearGradientBox />
      <Thumbnail />
      <VidInfo>
        <div>
          <VidTitle />
          <VidDesc />
        </div>
        <VidButton />
      </VidInfo>
    </VideoBox>
  );
};

export default VideoItemSkeleton;
