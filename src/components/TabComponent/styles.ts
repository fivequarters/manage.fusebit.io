import styled from "styled-components";

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