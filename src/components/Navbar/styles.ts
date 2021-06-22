import styled from "styled-components";
import navbarBg from "../../assets/navbar.svg";
import user from "../../assets/company-logo.svg";
import arrow from "../../assets/right-arrow-nav.svg";

export const Background = styled.div`
    width: 100vw;
    height: 216px;
    display: flex;
    background-image: url(${navbarBg});
    background-repeat: no-repeat;
    background-size: cover;
    padding-top: 67px;
`;

export const Nav = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

export const CompanyImg = styled.div`
    height: 56px;
    width: 56px;
    background-size: contain;
    background-image: url(${user});
    margin-right: 24px;
`;

export const CompanyName = styled.h3`
    font-size: 20px;
    line-height: 22px;
    font-weight: 600;
    color: #FF6422;
    margin-right: 8px;
`;

export const Arrow = styled.div`
    height: 10.5px;
    width: 8px;
    margin-right: 16px;
    background-size: contain;
    background-image: url(${arrow});
    background-repeat: no-repeat;
`;

export const SectionName = styled.h3`
    font-size: 20px;
    line-height: 22px;
    font-weight: 600;
    color: white;
`;

export const LinksContainer = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
`;

export const Link = styled.a`
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    text-decoration: none;
    color: white;
    margin-right: 72px;
`;

export const ButtonWrapper = styled.div`
    color: white;
    border: 1px solid rgba(215, 229, 255, 0.4);
    border-radius: 4px;
`;

export const User = styled.img`
    height: 24px;
    width: 24px;
    border-radius: 50%;
    object-fit: contain;
`;