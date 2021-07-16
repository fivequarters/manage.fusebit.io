import styled from "styled-components";
import ReactMarkdown from "react-markdown";

export const Card = styled.div<{open: boolean}>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    opacity: ${props => props.open ? 1 : 0};
    padding: 32px;
    width: 900px;
    height: 500px;
    border-radius: 8px;
    box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
    transition: all 1s linear;

    @media only screen and (max-width: 550px) {
        width: 100%;
        left: 0;
        top: auto;
        bottom: 0;
        transform: translate(0, 0);
    }
`;

export const Title = styled.h2`
    font-size: 26px;
    line-height: 22px;
    color: var(--black);
    font-weight: 600;
    margin-bottom: 24px;
`;

export const Flex = styled.div<{alignItems?: boolean}>`
    display: flex;
    align-items: ${props => props.alignItems && "center"};
`;

export const Column = styled.div<{border?: boolean}>`
    display: flex;
    flex-direction: column;
    width: 215px;
`;

export const ColumnItem = styled.div<{active: boolean}>`
    display: flex;
    align-items: center;
    padding: 12px;
    font-size: 16px;
    line-height: 18px;
    background-color: ${props => props.active && "var(--secondary-color)"};
    font-weight: ${props => props.active ? 600 : 400};
    width: 180px;
    transition: all .2s linear;

    &:hover {
        cursor: pointer;
        background-color: var(--secondary-color);
    }
`;

export const ColumnItemImage = styled.img`
    height: 20px;
    width: 20px;
    object-fit: contain;
    margin-right: 16px;
`;

export const ColumnSearch = styled.input`
    padding: 12px;
    font-size: 16px;
    line-height: 18px;
    border: none;
    outline: rgba(355,355,355,0);
    width: 100%;
    transition: all .2s linear;

    &::placeholder {
        font-family: "Poppins";
        font-size: 16px;
        line-height: 18px;
    }
`;

export const ConnectorInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 24px;
    width: 100%;
`;

export const ConnectorTitle = styled.h3`
    font-size: 18px;
    line-height: 18px;
    margin: 0;
    color: var(--black);
`;

export const ConnectorTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 12px;
`;

export const ConnectorVersion = styled.div`
    font-size: 16px;
    line-height: 18px;
    color: var(--black);
    margin-left: auto;
`;

export const ConnectorDescription = styled(ReactMarkdown)`
    font-size: 14px;
    line-height: 18px;
    color: var(--black);
    margin-top: 12px;
`;

export const ConnectorCustomize = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 18px;
    margin-top: 12px;
    font-weight: 600;
    margin-right: 20px;
`;

export const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    width: 316px;
    margin-top: 20px;
`;

export const FormInputWrapper = styled.div`
    margin: 0 auto;
    margin-top: 15px;

    @media only screen and (max-width: 880px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;