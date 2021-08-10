import styled from 'styled-components';

export const Content = styled.div`
  border-radius: 8px;
  margin-top: -30px;
  background-color: white;
  padding: 0 76px;
  box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
  margin-bottom: 72px;

  @media only screen and (max-width: 880px) {
    padding: 0;
    display: none;
  }
`;

export const ContentMobile = styled.div`
  position: relative;
  display: none;
  border-radius: 8px;
  margin-top: -30px;
  background-color: white;
  padding: 0;
  box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
  margin-bottom: 72px;

  @media only screen and (max-width: 880px) {
    display: block;
  }
`;

export const TabLabel = styled.div<{ active: boolean }>`
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  font-weight: ${(props) => props.active && 700};
  margin-bottom: 18px;
  margin-top: 30px;

  @media only screen and (max-width: 600px) {
    padding: 0px;
  }

  @media only screen and (max-width: 330px) {
    padding: 0;
  }
`;

export const Fade = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 20px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), white 80%);
  border-radius: 8px 8px 0 0;
  z-index: 1;

  @media only screen and (max-width: 330px) {
    width: 10px;
  }
`;

export const FadeLeft = styled(Fade)`
  left: 0;
  right: auto;
  background-image: linear-gradient(to left, rgba(255, 255, 255, 0), white 80%);
`;
