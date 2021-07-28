import styled from "styled-components";

export const Card = styled.div<{open: boolean}>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    opacity: ${props => props.open ? 1 : 0};
    padding: 64px;
    height: 544px;
    width: 642px;
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

export const Title = styled.h2`
    font-size: 24px;
    line-height: 26px;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 50px;
    text-align: center;
`;

export const Description = styled.p`
    font-size: 16px;
    line-height: 22px;
    color: var(--black);
    margin-top: 90px;
    margin-bottom: 24px;
`;

export const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0px auto;
    width: 400px;

    @media only screen and (max-width: 880px) {
        margin-left: 0;
    }
`;

export const FormInputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 64px;

    @media only screen and (max-width: 880px) {
        
    }
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
    width: 100%;
    height: 50px;
    padding: 16px;
    border: 0;
    margin: 0; 
    outline: rgba(255,255,255,0);
    border-radius: 4px;
    background-color: var(--secondary-color);
    overflow: hidden;
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

    @media only screen and (max-width: 1250px) {
        font-size: 14px;
        line-height: 16px;
        width: 100%;
    }
`;

export const LineInstructionFade = styled.div<{change: boolean, onlyMobileVisible?: boolean}>`
    display: ${props => props.onlyMobileVisible && "none"};
    position: absolute;
    right: 0;
    top: 0;
    height: 50px;
    width: ${props => props.change ? "300px": "60px"};
    background-image: linear-gradient(to left, #EFF5FF 10%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
    transition: all .25s linear;

    @media only screen and (max-width: 1250px) {
        right: -2px;
        display: ${props => props.onlyMobileVisible && "block"};
        width: 60px;
    }
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

    @media only screen and (max-width: 1250px) {
        opacity: 1;
    }
`;

export const CopySuccess = styled.p<{copy: boolean}>`
    display: block;
    position: absolute; 
    right: 0;
    bottom: -35px;
    font-size: 14px;
    line-height: 16px;
    color: var(--grey);
    opacity: ${props => props.copy ? 1 : 0};
    visibility: ${props => props.copy ? "visible" : "hidden"};
    margin-left: auto;
    transition: all .5s linear;
`;

export const UserCreatedButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 90px;
`;