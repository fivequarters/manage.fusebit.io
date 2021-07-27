import styled from "styled-components";

export const Overview = styled.div`
    display: flex;
    padding-bottom: 60px;
`;

export const FlexDown = styled.div`
    display: flex;
    flex-direction: column;
`;

export const UserCard = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 42px;
    height: 550px;
    width: 520px;
    box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
    z-index: 0;
    border-radius: 8px;
`;

export const UserInfoContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 54px;
`;

export const DotsWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 12px;
    padding: 0 10px;

    &:hover {
        cursor: pointer;
    }
`;

export const Dots = styled.img`
    height: 20px;
    width: 4px;
    object-fit: contain;
`;

export const UserImage = styled.img`
    height: 88px;
    width: 88px;
    object-fit: contain;
    border-radius: 50%;
    margin-right: 32px;
`;

export const UserName = styled.h3`
    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
    color: var(--primary-color);
    text-transform: uppercase;
    margin-bottom: 4px;
    margin-top: 0;
`;

export const UserCompany = styled.div`
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: var(--black);
    margin-bottom: 10px;
`;

export const UserId = styled.div`
    font-size: 14px;
    line-height: 20px;
    color: var(--black);

    strong {
        font-weight: 700;
    }

    img {
        height: 12px;
        width: 12px;
        object-fit: contain;
        margin-left: 16px;

        &:hover{
            cursor: pointer;
        }
    }
`;

export const InfoFieldWrapper = styled.div`
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
        margin-bottom: 24px;
    }
`;

export const InfoFieldPlaceholder = styled.div`
    font-size: 12px;
    line-height: 14px;
    font-weight: 300;
    color: var(--grey);
    margin-bottom: 4px;
`;

export const InfoField = styled.h4`
    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
    margin: 0;
    color: black;
`;

export const EditButtonWrapper = styled.div`
    margin-top: 48px;
`;

export const CLIAccesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 59px;
    margin-top: 52px;
`;

export const CLIAccess = styled.h4`
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    color: var(--black);
    margin: 0;
    margin-bottom: 40px;
`;

export const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    width: 316px;
`;

export const FormInputWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
`;