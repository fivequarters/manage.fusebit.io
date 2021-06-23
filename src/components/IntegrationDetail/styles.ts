import styled from "styled-components";

export const Content = styled.div`
    border-radius: 8px;
    margin-top: -30px;
    background-color: white;
    padding: 0 76px;
    box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
    margin-bottom: 72px;
`;

export const Background = styled.div`
    padding-bottom: 76px;
`;

export const TabLabel = styled.div<{active: boolean}>`
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    font-weight: ${props => props.active && 700};
    margin-bottom: 18px;
    margin-top: 30px;
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

export const CardConnectorWrapper = styled.div<{expanded: boolean}>`
    height: ${props => props.expanded ? "100%" : "184px"};
    overflow: hidden;
    transition: height .5s linear;
`;

export const CardConnector = styled.div`
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 4px;
    margin-bottom: 8px;
    background-color: var(--secondary-color);
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

export const CardConnectorSeeMore = styled.div<{expanded: boolean}>`
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 14px;
    font-weight: 300;
    color: var(--black);
    margin-left: auto;
    margin-top: 8px;
    margin-bottom: 24px;

    > img {
        margin-left: 7.25px;
        transform: ${props => props.expanded && "rotate(180deg)"};
        transition: all .25s linear;
    }

    &:hover {
        cursor: pointer;
    }
`;