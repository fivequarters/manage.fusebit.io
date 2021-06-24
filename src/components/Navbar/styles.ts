import styled from "styled-components";
import navbarBg from "../../assets/navbar.svg";
import user from "../../assets/company-logo.svg";
import arrow from "../../assets/right-arrow-nav.svg";

export const Background = styled.div`
    width: 100vw;
    height: 185px;
    display: flex;
    background-image: url(${navbarBg});
    background-repeat: no-repeat;
    background-size: cover;
    padding-top: 50px;
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
    color: var(--primary-color);
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

export const SectionDropdown = styled.div`
    display: flex;
    align-items: center;

    &:hover {
        cursor: pointer;
    }
`;

export const SectionDropdownMenu = styled.div`
    padding: 0px 32px 12px;
    width: 317px;
`;

export const SectionDropdownTitle = styled.h4`
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    color: var(--primary-color);
    margin-right: auto;
    margin-bottom: 16px;
`;

export const SectionDropdownSeeMore = styled.a`
    font-size: 12px;
    line-height: 14px;
    font-weight: 300;
    text-decoration: none;
    color: var(--black);

    & > img {
        margin-left: 9px;
    }

    &:hover {
        cursor: pointer;
    }
`;

export const SectionDropdownIntegration = styled.a<{active: boolean}>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 16px;
    border-radius: 4px;
    background-color: ${props => props.active ? "var(--secondary-color)" : "white"};
    font-size: 14px;
    line-height: 16px;
    font-weight: ${props => props.active ? 700 : 400};
    text-decoration: none;
    color: var(--black);
    margin-bottom: 5px;
    transition: all .25s linear;

    &:hover {
        background-color: var(--secondary-color);
        cursor: pointer;
    }

    & > img {
        margin-left: auto;
        display: ${props => props.active ? "block" : "none"};
    }
`;

export const Flex = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

export const SectionName = styled.h3`
    font-size: 20px;
    line-height: 22px;
    font-weight: 600;
    margin-right: 10px;
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