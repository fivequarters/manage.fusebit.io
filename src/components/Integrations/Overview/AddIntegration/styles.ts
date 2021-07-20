import styled from "styled-components";
import ReactMarkdown from "react-markdown";

export const Card = styled.div<{open: boolean}>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    opacity: ${props => props.open ? 1 : 0};
    padding: 64px;
    width: 1140px;
    height: 671px;
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
    font-size: 24px;
    line-height: 26px;
    color: var(--black);
    font-weight: 600;
    margin: 0;
    margin-bottom: 49px;
`;

export const Flex = styled.div<{alignItems?: boolean}>`
    display: flex;
    align-items: ${props => props.alignItems && "center"};
`;

export const Column = styled.div<{border?: boolean}>`
    display: flex;
    flex-direction: column;
    height: 490px;
`;

export const ColumnItem = styled.div<{active: boolean}>`
    display: flex;
    align-items: center;
    padding: 11px 16px;
    font-size: 16px;
    line-height: 18px;
    background-color: ${props => props.active && "var(--secondary-color)"};
    font-weight: ${props => props.active ? 600 : 400};
    width: 254px;
    transition: background-color .2s linear;
    margin-bottom: 8px;
    border-radius: 4px;

    &:hover {
        cursor: pointer;
        background-color: var(--secondary-color);
    }
`;

export const ColumnItemImage = styled.img`
    height: 18px;
    width: 18px;
    object-fit: contain;
    margin-right: 16px;
`;

export const ColumnBr = styled.div`
    width: 1px;
    height: 321px;
    background-color: #959595;
    opacity: 0.3;
    margin: 0 32px;
`;

export const ColumnSearchWrapper = styled.div`
    position: relative;
    margin-bottom: 32px;
`;

export const ColumnSearch = styled.input`
    font-family: "Poppins";
    padding: 7px 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--black);
    border: none;
    border-bottom: 1px solid var(--black);
    outline: rgba(355,355,355,0);
    width: 254px;
    transition: all .2s linear;

    &::placeholder {
        font-family: "Poppins";
        font-size: 14px;
        line-height: 20px;
        color: #959595;
    }
`;

export const ColumnSearchIcon = styled.img`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 24px;
    width: 24px;
    object-fit: contain;
`;

export const ConnectorInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 24px;
    width: 100%;
`;

export const ConnectorImage = styled.img`
    height: 28px;
    width: 28px;
    object-fit: contain;
    margin-right: 16px;
`;

export const ConnectorTitle = styled.h3`
    font-size: 20px;
    line-height: 26px;
    color: var(--black);
    margin: 0;
`;

export const ConnectorTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 12px;
`;

export const ConnectorVersion = styled.div`
    font-size: 12px;
    line-height: 14px;
    font-weight: 300;
    color: var(--black);
    margin-left: auto;
`;

export const ConnectorDescription = styled(ReactMarkdown)`
    font-size: 14px;
    line-height: 20px;
    color: var(--black);
    max-width: 300px;
    
    p {
        margin: 0;
        margin-top: 16px;
    }
`;

export const ConnectorCustomize = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    margin-right: 24px;
`;

export const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    width: 316px;
    margin-top: 38px;
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

export const Close = styled.img`
    height: 12px;
    width: 12px;
    object-fit: contain;
    position: absolute;
    top: 32px;
    right: 32px;
    transition: all .25s linear;

    &:hover {
        cursor: pointer;
        transform: rotate(90deg);
    }
`;

export const TextFielWrapper = styled.div`
    position: relative;
`;

export const Error = styled.p`
    color: var(--primary-color);
    margin: 0;
    position: absolute;
    left: 0;
    bottom: 5px;
    font-size: 0.75rem;
`;