import styled from 'styled-components';

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

export const CardConnectorImagePlaceholder = styled.div`
  height: 20px;
  width: 20px;
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

export const ModalWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  outline: transparent;
  padding: 64px;
  background-color: white;
  border-radius: 8px;
`;

export const Card = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 64px 64px;
  width: 449px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  outline: transparent;
  transition: all 1s linear;

  @media only screen and (max-width: 550px) {
    width: 100%;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
