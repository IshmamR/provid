import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VerticalAlignTopOutlined from "@ant-design/icons/VerticalAlignTopOutlined";

const AnchorToTop = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.colors.primary.light};
  background-color: ${({ theme }) => theme.colors.background};
  position: fixed;
  bottom: 30px;
  right: 30px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.6), 0 1px 2px -1px rgba(0, 0, 0, 0.9);
  transition: all 0.5s ease;

  .__back_to_top {
    font-size: 1.25rem;
  }
`;

const ScrollToTop: React.FC<
  React.HTMLAttributes<HTMLAnchorElement>
> = (): JSX.Element => {
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scroller = () => {
        // if scrolled more than 200: show scroller
        if (window.scrollY > window.innerHeight - 200) {
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
      };

      window.addEventListener("scroll", scroller, false);

      return () => window.removeEventListener("scroll", scroller, false);
    }
  }, []);

  const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <AnchorToTop
      style={{ transform: showBackToTop ? "scale(1)" : "scale(0)" }}
      onClick={handleOnClick}
    >
      <VerticalAlignTopOutlined className="__back_to_top" />
    </AnchorToTop>
  );
};

export default ScrollToTop;
