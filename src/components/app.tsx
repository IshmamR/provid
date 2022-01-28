import React, { useRef, useState } from "react";
import { Button, Image, Input } from "antd";
import styled from "styled-components";
import { down } from "styled-breakpoints";

const UrlInput = styled(Input)`
  padding: 0.75rem;
  border-radius: 10px 0 0 10px;
  border-color: ${({ theme }) => theme.colors.primary.main};
`;

const SubmitButton = styled(Button)`
  height: 100%;
  border-radius: 0 10px 10px 0;
`;

const Form = styled.form`
  width: 700px;
  max-width: 85vw;
  margin: auto;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 5fr 1fr; ;
`;

const VideoInfo = styled.div`
  margin: auto;
  margin-top: 2rem;
  width: 700px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: 1px 1px 4px 1px ${({ theme }) => theme.colors.gray.light};
  max-width: 85vw;
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  column-gap: 0.5rem;

  ${down("md")} {
    grid-template-columns: 1fr;
    row-gap: 1rem;
  }
`;

const Thumbnail = styled(Image)`
  max-width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 2px;
`;

const VideoTitle = styled.p`
  font-size: 1.25rem;
  line-height: 2rem;
  font-weight: 700;
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
  durations: string;
  view_count: number;
  url: string;
  fulltitle: string;
  _filename: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends React.HTMLAttributes<HTMLElement> {}

function App(props: IProps): JSX.Element {
  const [url, setUrl] = useState<string>("");
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<IVideoInfo | undefined>(undefined);

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

    if (navigator.clipboard.readText) {
      navigator.clipboard.readText().then((clipText) => {
        if (regex.test(clipText)) {
          setUrl(clipText);
        }
      });
    }
  }, []);

  const handleSubmit = (f: React.FormEvent<HTMLFormElement> | undefined) => {
    f?.preventDefault();
    setInfoLoading(true);

    const valid = regex.test(url);
    if (!valid) {
      setInfoLoading(false);
      return;
    }
    fetch(`/api/video/info?url=${url}`)
      .then((res) => res.json())
      .then((data) => {
        setInfo(data);
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
      .finally(() => setInfoLoading(false));
  };

  return (
    <>
      <Form onSubmit={handleSubmit} {...props}>
        <UrlInput
          ref={inputRef}
          value={url}
          onChange={handleChange}
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

      {info ? (
        <VideoInfo>
          <Thumbnail src={info.thumbnail} />
          <div>
            <VideoTitle>{info.title}</VideoTitle>
          </div>
        </VideoInfo>
      ) : null}
    </>
  );
}

export default App;
