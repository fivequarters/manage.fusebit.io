import styled from "styled-components";
import arrow from "../../../assets/table-arrow.svg";

export const DeleteWrapper = styled.div<{active: boolean}>`
    display: flex;
    align-items: center;
    opacity: ${props => props.active ? 1 : 0};
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;
    padding: 4px 18px;
    min-height: 57px;
    width: 100%;
    color: ${props => props.active ? "var(--primary-color)" : "var(--black)"};
    background-color: ${props => props.active && "rgba(248, 52, 32, .1)"};
    margin-bottom: 12px;
    transition: all .25s linear;
`;

export const DeleteIconWrapper = styled.div`
    margin-left: auto;
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
    color: var(--primary-color);
    font-weight: 500;
`;

export const Row = styled.tr`
    display: table-row;
    outline: 0;
    vertical-align: middle;
    color: inherit;
    text-decoration: none;

    &:hover {
        cursor: pointer;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    margin-top: 56px;
    width: 100%;
`;

export const ButtonMargin = styled.div`
    margin-left: auto;
    margin-bottom: 12px;
`;