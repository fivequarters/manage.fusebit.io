import styled from "styled-components";

export const Card = styled.div<{open: boolean}>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    opacity: ${props => props.open ? 1 : 0};
    padding: 32px;
    border-radius: 8px;
    box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
    width: 492px;
    transition: all 1s linear;

    @media only screen and (max-width: 550px) {
        width: 100%;
        left: 0;
        top: auto;
        bottom: 0;
        transform: translate(0, 0);
    }
`;