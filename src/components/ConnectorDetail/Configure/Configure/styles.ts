import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
  padding-bottom: 100px;

  @media only screen and (max-width: 880px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const FlexDown = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: max-content;

  @media only screen and (max-width: 880px) {
    margin-left: -82px;
  }
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
  width: 100%;
  margin-top: 20px;

  @media only screen and (max-width: 880px) {
    margin-left: 0;
  }
`;

export const FormInputWrapper = styled.div`
  margin-bottom: 49px;

  @media only screen and (max-width: 880px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
