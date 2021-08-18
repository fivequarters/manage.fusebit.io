import styled from 'styled-components';

export const Background = styled.div`
  padding-bottom: 76px;
`;

export const FlexDown = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child)  {
    margin-right: auto;

    @media only screen and (max-width: 1250px) {
      margin-right: 0;
    }
  }
`;

export const Flex = styled.div`
  position: relative;
  display: flex;

  @media only screen and (max-width: 1250px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const CardSeparator = styled.div`
  position: absolute;
  top: 186px;
  left: 0;
  height: 1px;
  width: 100%;
  background-color: var(--black);

  @media only screen and (max-width: 1250px) {
    height: calc(100% - 320px);
    width: 1px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  width: 389px;
  min-height: 392px;
  z-index: 1;
  margin-bottom: 40px;

  @media only screen and (max-width: 450px) {
    width: 340px;
  }
`;

export const CardTitle = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
`;

export const CardButtonWrapper = styled.div`
  margin: auto auto 0;
`;

export const CardIntegration = styled.div`
  font-size: 20px;
  line-height: 22px;
  font-weight: 600;
  color: var(--black);
  margin-top: 24px;

  > img {
    margin-right: 12px;
  }
`;

export const CardConnectorWrapper = styled.div`
  height: 100%;
`;

export const CardConnector = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: var(--secondary-color);

  &:hover {
    cursor: pointer;
  }
`;

export const CardConnectorImage = styled.img`
  height: 20px;
  width: 20px;
  object-fit: contain;
  margin-right: 16px;
`;

export const CardConnectorText = styled.h4`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--black);
  margin-right: auto;
`;

export const CardConnectorCrossContainer = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s linear;

  &:hover {
    transform: rotate(90deg);
  }
`;

export const CardConnectorCross = styled.img`
  height: 8px;
  width: 8px;
  object-fit: contain;

  &:hover {
    cursor: pointer;
  }
`;

export const CardConnectorButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  width: 100%;

  @media only screen and (max-width: 450px) {
    display: none;
  }
`;

export const CardConnectorButtonsWrapperMobile = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  width: 100%;

  @media only screen and (max-width: 450px) {
    display: flex;
  }
`;

export const CardConnectorSeeMore = styled.a`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  color: var(--black);
  margin-left: auto;
  margin-top: 8px;
  text-decoration: none;

  > img {
    margin-left: 7.25px;
    transition: all 0.25s linear;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const Bullet = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: var(--black);
  margin-right: 10px;
  transition: all 0.25s linear;
`;

export const Link = styled.a`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: none;
  width: max-content;
  margin-bottom: 16px;
  margin-left: 5px;
  transition: all 0.25s linear;

  &:hover {
    color: var(--primary-color);
    text-decoration: underline;

    > div {
      background-color: var(--primary-color);
    }
  }

  &:visited {
    color: #959595;

    > div {
      background-color: #959595;
    }
  }

  @media only screen and (max-width: 1250px) {
    display: none;
  }
`;

export const ConnectorList = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0 32px 12px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  width: fit-content;
  transition: all 1s linear;
  > div {
    max-height: 350px;
    overflow: auto;
  }
`;
