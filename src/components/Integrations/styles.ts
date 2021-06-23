import styled from "styled-components";
import arrow from "../../assets/table-arrow.svg";

export const Content = styled.div`
    border-radius: 8px;
    margin-top: -30px;
    background-color: white;
    padding: 0 76px;
    box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
    margin-bottom: 72px;
`;

export const TabLabel = styled.div<{active: boolean}>`
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    font-weight: ${props => props.active && 700};
    margin-bottom: 18px;
    margin-top: 30px;
`;

export const ArrowUp = styled.div`
    height: 10px;
    width: 10px;
    margin-right: 12px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(${arrow});
`;

export const Flex = styled.div`
    display: flex;
    align-items: center;
`;

export const CellName = styled.p`
    color: #FF6422;
    font-weight: 500;
`;

export const Row = styled.a`
    display: table-row;
    outline: 0;
    vertical-align: middle;
    color: inherit;
    text-decoration: none;
`;

export const ButtonContainer = styled.div`
    display: flex;
    margin-top: 56px;
    width: 100%;
`;

export const ButtonMargin = styled.div`
    margin-left: auto;
`;