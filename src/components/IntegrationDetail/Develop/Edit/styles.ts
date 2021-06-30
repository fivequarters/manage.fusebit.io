import styled from "styled-components";

export const Card = styled.div<{open: boolean}>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    background-color: white;
    opacity: ${props => props.open ? 1 : 0};
    padding: 32px 120px;
    border-radius: 8px;
    box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
    transition: all 1s linear;
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

export const Title = styled.h2`
    font-size: 24px;
    line-height: 26px;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 32px;
`;

export const LineTitle = styled.h4`
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 16px;
`;

export const LineInstructionWrapper = styled.div`
    position: relative;
    margin-bottom: 16px;

    &:hover {
        cursor: pointer;

        & > div {
            opacity: 1;
        } 
    }
`;

export const LineInstruction = styled.div`
    position: relative;
    width: 667px;
    height: 50px;
    padding: 16px;
    border: 0;
    margin: 0; 
    outline: rgba(255,255,255,0);
    border-radius: 4px;
    background-color: var(--secondary-color);
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    font-family: "Courier";
    font-size: 16px;
    line-height: 18px;
    color: var(--black);
    display: flex;
    
    & > span {
        color: var(--primary-color);
        font-weight: 400;
        margin: 0 10px;
    }

    & > strong {
        color: var(--primary-color);
        font-weight: 400;
        margin: 0 10px;
    }

    .unselectable {
        -webkit-user-select: none; /* Safari */        
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }
`;

export const LineInstructionFade = styled.div<{change: boolean}>`
    position: absolute;
    right: 0;
    top: 0;
    height: 50px;
    width: ${props => props.change ? "300px": "100px"};
    background-image: linear-gradient(to left, #EFF5FF 20%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
    transition: all .25s linear;
`;

export const LineInstructionCopy = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    height: 50px;
    width: 70px;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: var(--primary-color);
    z-index: 2;
    opacity: 0;
    transition: all .25s linear;
`;

export const ButtonsWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 16px;
`;

export const ContainerButtonWrapper = styled.div<{active: boolean}>`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => props.active ? 1 : 0};
    visibility: ${props => props.active ? "visible" : "hidden"};
    transition: all .5s linear;
`;

export const OutlinedButtonWrapper = styled.div`
    margin-left: auto;
`;