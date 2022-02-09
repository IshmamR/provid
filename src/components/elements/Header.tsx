import Link from "next/link";
import React from "react";
import { down } from "styled-breakpoints";
import styled from "styled-components";

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary.light};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 4px 4px;
`;

const LogoText = styled.h2`
  font-size: 1.5em;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.background};
  margin: 0;
  filter: drop-shadow(1px 1px 2px rgba(10, 0, 0, 0.2));

  ${down("md")} {
    font-size: 1.2em;
  }
`;

const Logo = styled.img`
  height: 30px;
  filter: drop-shadow(1px 1px 2px rgba(10, 0, 0, 0.2));

  ${down("sm")} {
    height: 25px;
  }
`;

const HeaderInner = styled.div`
  width: 1400px;
  max-width: 85%;
  margin: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  & > a {
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
  }

  & > a:hover {
    ${Logo}, ${LogoText} {
      filter: none;
    }
  }
`;

const Header: React.FC = (
  props: React.HTMLAttributes<HTMLElement>
): JSX.Element => {
  return (
    <HeaderContainer {...props}>
      <HeaderInner>
        <Link href={"/"}>
          <a>
            <Logo src={"/images/header_logo_new.png"} alt="provid logo png" />
            <LogoText>PROVID</LogoText>
          </a>
        </Link>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
