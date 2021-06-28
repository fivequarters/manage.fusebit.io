import styled from "styled-components";

export const Background = styled.div`
    padding-bottom: 76px;
`;

export const FlexDown = styled.div`
    display: flex;
    flex-direction: column;
    &:not(:last-child) {
        margin-right: auto;
    }
`;

export const Flex = styled.div`
    position: relative;
    display: flex;
`;

export const CardSeparator = styled.div`
    position: absolute;
    top: 186px;
    left: 0;
    height: 1px;
    width: 100%;
    background-color: var(--black);
`;

export const Card = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 32px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
    width: 389px;
    min-height: 392px;
    z-index: 1;
    margin-bottom: 40px;
`;

export const CardTitle = styled.h4`
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 16px;
`;

export const CardButtonWrapper = styled.div`
    margin: auto auto 0;
`;

export const CardIntegration = styled.div`
    font-size: 20px;
    line-height: 22px;
    font-weight: 600;
    color: var(--black);
    margin-top: 24px;

    > img {
        margin-right: 12px;
    }
`;

export const CardConnectorWrapper = styled.div`
    height: 100%;
`;

export const CardConnector = styled.div`
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 4px;
    margin-bottom: 8px;
    background-color: var(--secondary-color);

    &:hover { 
        cursor: pointer;
    }
`;

export const CardConnectorImage = styled.img`
    height: 20px;
    width: 20px;
    object-fit: cover;
    margin-right: 16px;
`;

export const CardConnectorText = styled.h4`
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: var(--black);
    margin-right: auto;
`;

export const CardConnectorCrossContainer = styled.div`
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .25s linear;

    &:hover {
        transform: rotate(90deg);
    }
`;

export const CardConnectorCross = styled.img`
    height: 8px;
    width: 8px;
    object-fit: contain;

    &:hover {
        cursor: pointer;
    }
`;

export const CardConnectorButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    width: 100%;
`;

export const CardConnectorSeeMore = styled.a`
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 14px;
    font-weight: 300;
    color: var(--black);
    margin-left: auto;
    margin-top: 8px;
    text-decoration: none;

    > img {
        margin-left: 7.25px;
        transition: all .25s linear;
    }

    &:hover {
        cursor: pointer;
    }
`;

export const Bullet = styled.div`
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background-color: var(--black);
    margin-right: 10px;
    transition: all .25s linear;

`;

export const Link = styled.a`
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 16px;
    color: var(--black);
    text-decoration: none;
    width: max-content;
    margin-bottom: 16px;
    margin-left: 5px;
    transition: all .25s linear;

    &:hover {
        color: var(--primary-color);
        text-decoration: underline;

        > div {
            background-color: var(--primary-color);
        }
    }

    &:visited {
        color: #959595;

        > div {
            background-color: #959595;
        }
    }
`;