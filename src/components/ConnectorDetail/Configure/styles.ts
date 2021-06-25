import styled from "styled-components";

export const Flex = styled.div`
    display: flex;
    padding-bottom: 100px;
`;

export const FlexDown = styled.div`
    display: flex;
    flex-direction: column;
`;

export const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    width: max-content;
`;

export const InfoTitle = styled.h4`
    font-size: 16px;
    line-height: 18px;
    color: black;
    font-weight: 600;
    margin-right: 8px;
`;

export const InfoDescription = styled.p`
    font-size: 16px;
    line-height: 18px;
    color: black;
`;

export const InfoLink = styled.a`
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 18px;
    color: var(--primary-color);
    text-decoration: none;

    & > img {
        margin-left: 8px;
    }
`;

export const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    margin-left: 150px;
    margin-top: 20px;
`;

export const FormInputWrapper = styled.div`
    margin-bottom: 49px;
`;