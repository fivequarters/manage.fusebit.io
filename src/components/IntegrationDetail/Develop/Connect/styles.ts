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

export const CardClose = styled.div`
    height: 20px;
    width: 20px;
    position: absolute;
    top: 25px;
    right: 25px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        cursor: pointer;

        & > img {
            transform: rotate(90deg);
        }
    }

    & > img {
        height: 10px;
        width: 10px;
        object-fit: contain;
        transition: all .25s linear;
    }
`;

export const CardTitle = styled.h3`
    font-size: 20px;
    line-height: 22px;
    text-align: center;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 32px;
`;

export const CardSubtitle = styled.h5`
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    text-align: center;
    color: var(--black);
    margin-bottom: 16px;
`;

export const CardButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 36px;
`;

export const CardActionButtons = styled.div`
    display: flex;
    align-items: center;
    margin-top: 16px;
`;